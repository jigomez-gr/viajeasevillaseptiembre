const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'videos_itinerario');

function renameInDir(dirName, mappings) {
    const dirPath = path.join(baseDir, dirName);
    if (!fs.existsSync(dirPath)) {
        console.log(`Directory ${dirPath} does not exist.`);
        return;
    }
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
            if (file.toLowerCase().includes('mariví') || file.toLowerCase().includes('marivi')) {
                const subFiles = fs.readdirSync(fullPath);
                subFiles.forEach(subFile => {
                    if (subFile.endsWith('.mp4')) {
                        const subFilePath = path.join(fullPath, subFile);
                        const targetPath = path.join(dirPath, 'marivi_blasco_javier_somoza.mp4');
                        fs.renameSync(subFilePath, targetPath);
                        console.log(`Renamed sub-directory video ${subFile} to ${targetPath}`);
                    }
                });
                try {
                    fs.rmdirSync(fullPath);
                    console.log(`Removed empty directory ${fullPath}`);
                } catch (e) {
                    console.error(e);
                }
            }
            return;
        }

        for (const key in mappings) {
            if (file.toLowerCase().includes(key.toLowerCase())) {
                const newName = mappings[key];
                const newPath = path.join(dirPath, newName);
                fs.renameSync(fullPath, newPath);
                console.log(`Renamed: ${file} -> ${newName}`);
                break;
            }
        }
    });
}

renameInDir('dia0', {
    'Estaciones': 'estaciones_santa_justa.mp4'
});

renameInDir('dia1', {
    'casala': 'casala_teatro.mp4',
    'cerámica_de_triana': 'centro_ceramica_triana.mp4',
    'institución_honorífica': 'mercado_triana.mp4',
    'santa_ana': 'parroquia_santa_ana.mp4',
    'sirenas': 'silva_de_sirenas.mp4'
});

renameInDir('dia2', {
    'heras-casado': 'heras_casado_mendelssohn.mp4',
    'alcázar': 'real_alcazar.mp4'
});

renameInDir('dia3', {
    'boda': 'boda_imperial_500.mp4',
    'bellas_artes': 'bellas_artes.mp4',
    'salvador': 'divino_salvador.mp4'
});

renameInDir('dia4', {
    'salinas': 'casa_salinas.mp4',
    'catedral': 'catedral_giralda.mp4',
    'jardines': 'jardines_alcazar.mp4',
    'arpeggiata': 'toccata_arpeggiata.mp4'
});

renameInDir('dia5', {
    'indias': 'archivo_indias.mp4',
    'victoria': 'nao_victoria.mp4',
    'abades': 'abades_triana.mp4'
});

console.log('Renaming completed successfully!');
