const canvases = JSON.parse(window.localStorage.getItem('canvases')) || [];

class Table {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.drawing = false;
    this.activeColor = 'rgb(27 95 216)';
  }
  buildTable() {
    this.tableElement = document.createElement('table');
    for(let i = 0; i < this.height; i++) {
      const row = document.createElement('tr');
      for(let j = 0; j < this.width; j++) {
        const data = document.createElement('td');
        row.append(data);
      }
      this.tableElement.append(row);
    }
    document.body.append(this.tableElement);
    document.addEventListener('dblclick', e => {
      this.drawing = false;
      if(
        e.target === this.palletElement
        || this.palletElement.contains(e.target)
        || e.target === document.querySelector('form')
        || document.querySelector('form').contains(e.target)
        || e.target === document.querySelector('form')
        || e.target.nodeName === 'TD'
      ) return;     
      this.reset();
    });
    document.addEventListener('mousedown', e => {
      if(
        e.target === this.palletElement
        ||this.palletElement.contains(e.target)
        || e.target === document.querySelector('form')
        || document.querySelector('form').contains(e.target)
      ) return;
      
      this.drawing = !this.drawing;
      if(e.target.nodeName === 'TD') {
        e.target.style.background = this.activeColor;
      }
    });
    this.tableElement.addEventListener('mousemove', e => {
      if(e.target.nodeName === 'TD' && this.drawing) {
        e.target.style.background = this.activeColor;
      }
    });
    return this;
  }
  reset() {
    this.tableElement
      .querySelectorAll('td')
      .forEach(td => td.style.background = '');
  }
  buildPallet() {
      const colors = {
          orange: 'rgb(255 134 76)',
          red: 'rgb(222 15 15)',
          blue: 'rgb(27 95 216)',
          purple: 'rgb(140 41 230)',
          green: '#9FE2BF',
          yellow: '#FFBF00',
          black: '#111',
          white: '#E8E8E8'
      };
      this.palletElement = document.createElement('div');
      this.palletElement.classList.add('pallet');
      this.activeColorElement = document.createElement('div');
      this.activeColorElement.classList.add('active-color');
      this.activeColorElement.style.background = this.activeColor;
      this.palletElement.append(this.activeColorElement);
      this.palletColorsContainer = document.createElement('div');
      this.palletColorsContainer.classList.add('pallet-colors-container');
      this.palletElement.append(this.palletColorsContainer);
      for(let color in colors) {
        let col = document.createElement('div');
        col.style.background = colors[color];
        col.classList.add('color');
        //col.dataSet.color = colors[color];
        this.palletColorsContainer.append(col);
      }      
      this.palletColorsContainer.addEventListener('click', e => {
        this.drawing = false;
        this.activeColor = e.target.style.background;
        this.activeColorElement.style.background = this.activeColor;
      });
      document.body.append(this.palletElement);      
      return this;      
  }
}

class Save {
  constructor(name) {
    this.savedCanvas = { name };
  }
  saveCanvas() {
    const table = document.querySelector('table');
    const rows = table.querySelectorAll('tr');
    this.savedCanvas.pixels = [];
    rows.forEach((row, i) => {
      this.savedCanvas.pixels.push([]);
      row.querySelectorAll('td').forEach(pixel => {
        this.savedCanvas.pixels[i].push(pixel.style.background);
      });
    });
    if(canvases.filter(c => c.name === this.savedCanvas.name).length > 0) {
      canvases.splice(canvases.indexOf(canvases.filter(c => c.name === this.savedCanvas.name)[0]), 1);
    }
    canvases.push(this.savedCanvas);
    window.localStorage.setItem('canvases', JSON.stringify(canvases));
    return this;
  }
}

class Load {
  constructor(name) {
    this.name = name;    
  }
  loadCanvas() {
    const canvasToLoad = canvases.filter(c => c.name === this.name)[0];
    document.querySelector('table')
      .querySelectorAll('tr')
      .forEach((row, i) => {
        row.querySelectorAll('td')
          .forEach((pixel, j) => {
            pixel.style.background = canvasToLoad.pixels[i][j];
          });
    });
    return this;
  }
}

const saveInput = document.querySelector('#save');
saveInput.addEventListener('keydown', e => {
  if(e.key === 'Enter') {
    let save = new Save(e.target.value).saveCanvas();
    e.target.value = '';
    console.log(canvases);
  }
});

const loadInput = document.querySelector('#load');
loadInput.addEventListener('keydown', e => {
  if(e.key === 'Enter') {
    let load = new Load(e.target.value).loadCanvas();
    e.target.value = '';
    console.log(canvases);
  }
});

const table1 = new Table(53, 43);
table1.buildTable().buildPallet();