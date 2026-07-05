import os
import sys
import subprocess
import json
import re
from pathlib import Path
from collections import Counter

# Set up paths
THIS_DIR = Path(__file__).resolve().parent
SKILL_DIR = THIS_DIR.parent.parent
SCRIPTS_DIR = SKILL_DIR / "scripts"
LINT_PY = SCRIPTS_DIR / "lint_source.py"

print("remotion-to-hyperframes Windows corpus run")
print("==========================================")

# Ensure output directory for reports and temp files
results = []

def run_cmd(args, cwd=None):
    res = subprocess.run(args, cwd=cwd, capture_output=True, text=True, shell=True)
    return res

# --- T2 setup ---
print("\n[Setup] Generating binary assets for Tier 2...")
t2_dir = THIS_DIR / "tier-2-multi-scene"
os.makedirs(t2_dir / "remotion-src/public", exist_ok=True)
os.makedirs(t2_dir / "hf-src/assets", exist_ok=True)

# Generate 200x200 solid blue PNG
run_cmd([
    "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
    "-f", "lavfi", "-i", "color=color=#3066be:size=200x200", "-frames:v", "1",
    str(t2_dir / "remotion-src/public/square.png")
])
import shutil
shutil.copy(t2_dir / "remotion-src/public/square.png", t2_dir / "hf-src/assets/square.png")

# Generate 6-second silent WAV
run_cmd([
    "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
    "-f", "lavfi", "-i", "anullsrc=cl=mono:r=8000", "-t", "6", "-acodec", "pcm_s16le",
    str(t2_dir / "remotion-src/public/music.wav")
])
shutil.copy(t2_dir / "remotion-src/public/music.wav", t2_dir / "hf-src/assets/music.wav")
print("  ✓ T2 assets generated")


def run_render_tier(fixture_name, composition_id, threshold):
    fixture_dir = THIS_DIR / fixture_name
    print(f"\n[Tier] {fixture_name} (threshold {threshold}, composition {composition_id})")
    
    # 1. Lint
    print("  ⏳ linting source...")
    sys.path.insert(0, str(SCRIPTS_DIR))
    from lint_source import lint_file, BLOCKER
    src_dir = fixture_dir / "remotion-src/src"
    files = sorted(
        p
        for p in src_dir.rglob("*")
        if p.is_file()
        and p.suffix in {".ts", ".tsx", ".jsx", ".js"}
        and "node_modules" not in p.parts
    )
    findings = []
    for f in files:
        findings.extend(lint_file(f))
        
    has_blockers = any(f.severity == BLOCKER for f in findings)
    if has_blockers:
        print("  ✗ lint failed (blockers in Remotion source)")
        results.append({"fixture": fixture_name, "status": "fail", "stage": "lint"})
        return
        
    # 2. Render Remotion baseline
    print("  ⏳ rendering Remotion baseline...")
    remotion_dir = fixture_dir / "remotion-src"
    out_mp4 = remotion_dir / "out/baseline.mp4"
    os.makedirs(remotion_dir / "out", exist_ok=True)
    
    cmd_remotion = ["npx", "remotion", "render", composition_id, "out/baseline.mp4"]
    res_rem = run_cmd(cmd_remotion, cwd=remotion_dir)
    if res_rem.returncode != 0 or not out_mp4.exists():
        print(f"  ✗ Remotion render failed: {res_rem.stderr}")
        results.append({"fixture": fixture_name, "status": "fail", "stage": "remotion-render"})
        return

    # 3. Render HF translation
    print("  ⏳ rendering HF translation...")
    hf_mp4 = fixture_dir / "hf.mp4"
    cmd_hf = ["npx", "hyperframes", "render", "hf-src/", "--output", "hf.mp4", "--quiet"]
    res_hf = run_cmd(cmd_hf, cwd=fixture_dir)
    if res_hf.returncode != 0 or not hf_mp4.exists():
        print(f"  ✗ HF render failed: {res_hf.stderr}")
        results.append({"fixture": fixture_name, "status": "fail", "stage": "hf-render"})
        return

    # 4. Compute SSIM diff via ffmpeg
    print("  ⏳ computing SSIM diff...")
    diff_dir = fixture_dir / "diff"
    os.makedirs(diff_dir, exist_ok=True)
    ssim_log = diff_dir / "ssim.log"
    summary_json = diff_dir / "summary.json"
    
    cmd_diff = [
        "ffmpeg", "-hide_banner", "-nostats", "-loglevel", "info",
        "-i", "remotion-src/out/baseline.mp4", "-i", "hf.mp4",
        "-lavfi", "[0:v]scale=iw:ih[ref];[1:v]scale=iw:ih[main];[main][ref]ssim=stats_file=diff/ssim.log",
        "-f", "null", "-"
    ]
    res_diff = run_cmd(cmd_diff, cwd=fixture_dir)
    
    if not ssim_log.exists():
        print(f"  ✗ FFmpeg SSIM log generation failed. Return code: {res_diff.returncode}")
        print(f"    Stderr: {res_diff.stderr}")
        print(f"    Stdout: {res_diff.stdout}")
        results.append({"fixture": fixture_name, "status": "fail", "stage": "ssim-log"})
        return
        
    # Parse SSIM log
    values = []
    pattern = re.compile(r"All:([\d.]+)")
    for line in ssim_log.read_text(encoding='utf-8', errors='ignore').splitlines():
        m = pattern.search(line)
        if m:
            values.append(float(m.group(1)))
            
    if not values:
        print("  ✗ Failed to parse any SSIM values from log")
        results.append({"fixture": fixture_name, "status": "fail", "stage": "ssim-parse"})
        return
        
    mean_ssim = sum(values) / len(values)
    values_sorted = sorted(values)
    minimum = values_sorted[0]
    p05 = values_sorted[int(len(values) * 0.05)]
    p95 = values_sorted[int(len(values) * 0.95)]
    
    is_passed = mean_ssim >= threshold
    summary_data = {
        "mean": mean_ssim,
        "min": minimum,
        "p05": p05,
        "p95": p95,
        "frame_count": len(values),
        "pass": is_passed,
        "threshold": threshold
    }
    
    with open(summary_json, "w") as f:
        json.dump(summary_data, f, indent=2)
        
    if is_passed:
        print(f"  ✓ pass (mean SSIM {mean_ssim:.4f}, threshold {threshold})")
        results.append({
            "fixture": fixture_name, "status": "pass", 
            "mean_ssim": mean_ssim, "threshold": threshold
        })
    else:
        print(f"  ✗ fail (mean SSIM {mean_ssim:.4f}, threshold {threshold})")
        # generate strip on fail
        strip_dir = fixture_dir / "strip"
        os.makedirs(strip_dir, exist_ok=True)
        results.append({
            "fixture": fixture_name, "status": "fail", "stage": "ssim",
            "mean_ssim": mean_ssim, "threshold": threshold
        })


# --- Run render tiers ---
run_render_tier("tier-1-title-card", "TitleCard", 0.95)
run_render_tier("tier-2-multi-scene", "MultiScene", 0.95)
run_render_tier("tier-3-data-driven", "Stargazed", 0.90)

# --- Run Tier 4 (Lint only) ---
print("\n[Tier] tier-4-escape-hatch (lint-only)")
t4_dir = THIS_DIR / "tier-4-escape-hatch"
expected_path = t4_dir / "expected.json"

from lint_source import BLOCKER, WARNING, lint_file
expected = json.loads(expected_path.read_text())

fails = []
passes = []

for case in expected["cases"]:
    file_name = case["file"]
    fixture = t4_dir / "cases" / file_name
    findings = lint_file(fixture)
    rule_counts = Counter()
    severity_by_rule = {}
    for f in findings:
        rule_counts[f.rule] += 1
        severity_by_rule[f.rule] = f.severity

    case_failed = False

    def assert_rule(expected_entry, expected_severity_floor, kind):
        global case_failed
        rule = expected_entry["rule"]
        min_count = expected_entry["min_count"]
        actual = rule_counts[rule]
        actual_severity = severity_by_rule.get(rule)
        if actual < min_count:
            fails.append(f"{file_name}: expected >={min_count} {kind} findings of rule {rule}, got {actual}")
            case_failed = True
        elif actual_severity not in expected_severity_floor:
            fails.append(f"{file_name}: rule {rule} found but severity={actual_severity} (expected {kind})")
            case_failed = True

    for entry in case["expected"]["blockers"]:
        assert_rule(entry, {BLOCKER}, "blocker")
    for entry in case["expected"]["warnings"]:
        assert_rule(entry, {WARNING, BLOCKER}, "warning")

    has_blockers = any(f.severity == BLOCKER for f in findings)
    expected_has_blockers = bool(case["expected"]["blockers"])
    if has_blockers != expected_has_blockers:
        fails.append(f"{file_name}: blocker presence mismatch. Actual: {has_blockers}, Expected: {expected_has_blockers}")
        case_failed = True

    if not case_failed:
        passes.append(file_name)

if not fails:
    print("  ✓ pass (8/8 cases)")
    results.append({"fixture": "tier-4-escape-hatch", "status": "pass", "mode": "lint"})
else:
    print("  ✗ fail (some cases mismatched expected.json)")
    print("\n".join(fails))
    results.append({"fixture": "tier-4-escape-hatch", "status": "fail", "mode": "lint"})


# Write final aggregate report
total = len(results)
passed = sum(1 for r in results if r["status"] == "pass")
failed = sum(1 for r in results if r["status"] == "fail")
skipped = sum(1 for r in results if r["status"] == "skipped")

report = {
    "total": total,
    "passed": passed,
    "failed": failed,
    "skipped": skipped,
    "results": results,
}

report_path = THIS_DIR / "run-report.json"
with open(report_path, "w") as f:
    json.dump(report, f, indent=2)

print("\n" + "="*50)
print(f"  passed {passed}/{total}, failed {failed}, skipped {skipped}")
print(f"  report → {report_path}")
print("="*50)

sys.exit(0 if failed == 0 and skipped == 0 else 1)
