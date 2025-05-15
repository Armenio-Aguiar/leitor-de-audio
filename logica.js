let musica = document.querySelector('audio');
let musicas = [];
let posicao = 0;

document.querySelector('#carregarMusicas').addEventListener('change', async function (event) {
    document.querySelector('#carregarMusicas').style.display = 'none';
    const arquivos = Array.from(event.target.files);
    let lista = document.querySelector('#ListaMusicas');

    musicas = arquivos.filter(arquivo => arquivo.type === 'audio/mpeg');

    for (const arquivo of musicas) {
        const metadata = await LerMetadado(arquivo);
        const titulo = metadata?.title || arquivo.name;

        const item = document.createElement('li');
        item.textContent = `${titulo}`;
        lista.appendChild(item);

        item.addEventListener('click', () => {
            posicao = musicas.indexOf(arquivo);
            tocarMusica(arquivo);
            destacarMusicaAtual(item);
        });
    }
});

function destacarMusicaAtual(itemSelecionado) {
    document.querySelectorAll('#ListaMusicas li').forEach(item => {
        item.style.color = ''; //limpa a cor da playlist 
    });
    itemSelecionado.style.color = '#777'; // destaca a musica que esta a musica
}

async function LerMetadado(file) {
    try {
        const metadata = await musicMetadata.parseBlob(file);
        return metadata.common;
    } catch (error) {
        console.log('Erro ao ler metadados:', error);
        return {};
    }
}

function tocarMusica(arquivo) {
    const url = URL.createObjectURL(arquivo);
    musica.src = url;
    musica.play();

    document.querySelector('#pause').style.display = 'block';
    document.querySelector('#play').style.display = 'none';

    LerMetadado(arquivo).then(metadata => {
        const titulo = metadata?.title || arquivo.name;
        const artista = metadata?.artist || "";
        document.querySelector('.descricao h2').textContent = titulo;
        document.querySelector('.descricao i').textContent = artista;
    });

    document.querySelector('.volume p').textContent = Math.floor(musica.volume * 100);
}

document.querySelector('#play').addEventListener('click', () => {
    musica.play();
    document.querySelector('#pause').style.display = 'block';
    document.querySelector('#play').style.display = 'none';
});

document.querySelector('#pause').addEventListener('click', () => {
    musica.pause();
    document.querySelector('#pause').style.display = 'none';
    document.querySelector('#play').style.display = 'block';
});

document.querySelector('#depois').addEventListener('click', () => {
    if (posicao < musicas.length - 1) {
        posicao++;
        tocarMusica(musicas[posicao]);
        destacarMusicaAtual(document.querySelectorAll('#ListaMusicas li')[posicao]);
    }
});

document.querySelector('#antes').addEventListener('click', () => {
    if (posicao > 0) {
        posicao--;
        tocarMusica(musicas[posicao]);
        destacarMusicaAtual(document.querySelectorAll('#ListaMusicas li')[posicao]);
    }
});

musica.addEventListener('loadedmetadata', () => {
    document.querySelector('.fim').textContent = formatarTempo(Math.round(musica.duration));
    document.querySelector('progress').max = musica.duration;
});

musica.addEventListener('timeupdate', () => {
    document.querySelector('progress').value = musica.currentTime;
    document.querySelector('.inicio').textContent = formatarTempo(Math.round(musica.currentTime));
});

document.querySelector('#volume').addEventListener('input', () => {
    musica.volume = document.querySelector('#volume').value;
    document.querySelector('.volume p').textContent = Math.floor(musica.volume * 100);
});

function formatarTempo(tempo) {
    const min = Math.floor(tempo / 60);
    const seg = tempo % 60 < 10 ? '0' + (tempo % 60) : tempo % 60;
    return `${min}:${seg}`;
}
