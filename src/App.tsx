import { useState, useEffect, useRef } from 'react';
import random from 'random';
import './App.css';


function App() {
  const [ loading, setLoading ] = useState(true);
  const [ curPainter, setCurPainter ] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const painters: string[] = [ 
    'Francisco Goya',
    'Rembrandt van Rijn',
    'Paolo Veronese',
    'Tintoretto'
  ];

  const text: string[] = [
    'YAZILIM ÖĞRENİN',
    'YAZILIM İŞİNDE/PARA VAR',
    'PYTHON ÖĞREN/GELİŞTİR KENDİNİ',
    'YAZILIM ÖĞRENSEN/İYİ OLUR',
    'GELECEK YAZILIMDA/ÖĞRENMEK LAZIM',
    'YAZILIM TAMAM DA/ROBOTİK DE ÖNEMLİ',
    `${new Date().getFullYear() + 1}/MOBİLİN YILI OLACAK`
  ]

  const getData = async () => {
    setLoading(true);
    const url: string = `https://openaccess-api.clevelandart.org/api/artworks/?artists=${encodeURIComponent(painters[curPainter])}&has_image=1`;

    const res: Response = await fetch(url);
    const json = await res.json();
    const dataLen = json.data.length;

    const randdata = json.data[random.int(0, dataLen - 1)]; 

    const imgurl = randdata?.images?.web.url;
    const width = randdata?.images?.web.width;
    const height = randdata?.images?.web.height;

    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx) return null;

      const img = new Image();
      img.src = imgurl;

      const t = text[random.int(0, text.length - 1)];

      const top = t.split('/')[0].trim();
      const bottom = t.split('/')[1]?.trim() || '';

      img.onload = () => {
        canvas.width = width;
        canvas.height = height;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, width, height);

        ctx.drawImage(img, 0, 0);

        ctx.font = `bold ${Math.floor(width / 15)}px Helvetica`;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowColor = 'rgba(0, 0, 0, 1)';
        ctx.shadowBlur = 5;
        ctx.fillStyle= '#FFF';

        ctx.fillText(top, (width - ctx.measureText(top).width) / 2, 80);
        ctx.fillText(bottom, (width - ctx.measureText(bottom).width) / 2, height - 20);

        setLoading(false);
      } 
    }

    console.log(`${painters[curPainter]} yazılım öğrenmeni öğütlüyor`);
    setCurPainter(prev => (prev + 1) % painters.length);
  }

  useEffect(() => {
    console.log('buraya bakma burda bişi yok --> yazılım öğren');
    random.use(Date.now().toString());
    getData();
  }, []);

  return (
    <div className="App">
      <h1>Yazılım Öğren Meme Generator</h1>
      <div style={{ width: 600, border: '5px solid #222', padding: 5, marginLeft: 'auto', marginRight: 'auto', marginTop: 30 }}>

        <div className='btn' onClick={getData}>⟲ Generate </div>

        {
          loading && <div>Yazılım Öğreniyoruz Bekle İki Dakika...</div> 
        }

        <canvas style={{ maxWidth: '100%', display: loading ? 'none' : 'initial' }} ref={canvasRef} />
      </div>
    </div>
  );
}

export default App;
