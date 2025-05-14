let musica=document.querySelector('audio'); //pegando o ficheiro audio
document.querySelector('#carregarMusicas').addEventListener('change', async function (event) { //manipula quase tudo
    document.querySelector('#carregarMusicas').style.display='none'
    const arquivos=Array.from(event.target.files);
    const lista= document.querySelector('#ListaMusicas')
    for(const arquivo of arquivos){
        if(arquivo.type==='audio/mpeg'){
            const metadata=await LerMetadado(arquivo);
            const titulo=metadata?.Nome || arquivo.name;
            const artista = metadata?.artist || "";

            const item=document.createElement('li');
            item.textContent=`${artista} - ${titulo}`
            lista.appendChild(item)

            item.addEventListener('click',()=>{
                const url=URL.createObjectURL(arquivo)
                musica.src=url
                musica.play()
                item.style.color='#777'
                document.querySelector('#pause').style.display='block'
                document.querySelector('#play').style.display='none'
                document.querySelector('.descricao h2').textContent=titulo
                document.querySelector('.descricao i').textContent=artista
                document.querySelector('.volume p').textContent=Math.floor(musica.volume*100)
            })
            document.querySelector('#depois').addEventListener('click',()=>{
               /* posicao++
                musica.setAttribute('src',arquivo[posicao]+)
                musica.play()*/ //ainda por construir esse metedo 
                console.log(typeof(arquivo))
            })
        }
    }
})
async function LerMetadado(file) { //carrega os metadados
    try {
        const metadata= await musicMetadata.parseBlob(file)
        return metadata.common
    } catch (error) {
        console.log('Error de leitura de metadados',error)
        return {}
    }
}
musica.addEventListener('loadedmetadata', () => { //Metedo para pegar a duraçao da musica
    let duracao=document.querySelector('.fim').textContent=RondTime(Math.round(musica.duration))
  });
document.querySelector('#play').addEventListener('click',()=>{ //Metodo para por play 
    musica.play()
    document.querySelector('#pause').style.display='block'
    document.querySelector('#play').style.display='none'
})
document.querySelector('#pause').addEventListener('click',()=>{ //Metodo para pausar a musica
    musica.pause()
    document.querySelector('#pause').style.display='none'
    document.querySelector('#play').style.display='block'
})
musica.addEventListener('timeupdate',()=>{ //Metodo para acessar o tempo da musica tocando e manipulando na barra de progresso
    let progss=document.querySelector('progress')
    progss.style.width=Math.round((musica.currentTime/musica.duration)*100)+'%'
    document.querySelector('.inicio').textContent=RondTime(Math.round(musica.currentTime))
})
function RondTime(tempo){ //Metodo para  converter o tempo em minuto e segundo que recebe como parametro um tempo
    let min=Math.floor(tempo/60)
    let sg=tempo%60<10? '0'+tempo%60:tempo%60
    return min+':'+sg
}

/*document.querySelector('#antes').addEventListener('click',()=>{
    posicao--
    musica.setAttribute('src',musicas[posicao].cançao)
    musica.play()  //por refazer
})*/

document.querySelector('#volume').addEventListener('input',()=>{
    musica.volume=document.querySelector('#volume').value
    document.querySelector('.volume p').textContent=Math.floor(musica.volume*100)
})

