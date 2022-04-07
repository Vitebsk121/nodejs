const fs = require('fs');
const { argv } = process;

const [ command, title, content ] = argv.slice(2);

switch (command) {
  case 'create':
    create(title, content)
    break;
  case 'list':
    list();
    break;
  case 'view':
    view(title);
    break;
  case 'remove':
    remove(title);
    break;
}


function create(title, content) {

  const setFile = async () => {
    const init = async () => {
      await fs.writeFile('notes.json', '[]', err => {
        if (err) console.error(err.message);
      })
    }

    await new Promise((res) => {
      fs.access('notes.json', fs.constants.W_OK, async err => {
        if (err) await init()
        res();
      })
    })
  }

  setFile().then(() => {
    fs.readFile('notes.json', 'utf-8', async (err, data) => {
      if (err) console.error(err.message);
      const notes = await JSON.parse(data);
      notes.push({title, content});
      const json = JSON.stringify(notes);

    fs.writeFile('notes.json', json, err1 => {
      if (err1) console.error(err1.message);
      console.log('Заметка создана');
    })
    });
  })
}

function list() {
  fs.readFile('notes.json', (err, data) => {
    if (err) console.log(err.message);
    const notes = JSON.parse(data);
    notes.forEach((note, index) => console.log((index + 1) + ' ' + note.title));
  })
}

function view(title) {
  fs.readFile('notes.json', async (err, data) => {
    if (err) console.log(err.message);
    const notes = await JSON.parse(data);
    const note = notes.filter(note => note.title === title)[0];
    console.log(note.content);
  })
}

function remove(title) {
  fs.readFile('notes.json', async (err, data) => {
    if (err) console.error(err.message);
    const notes = await JSON.parse(data);
    const newNotes = notes.filter(note => note.title !== title);
    const json = JSON.stringify(newNotes);

    fs.writeFile('notes.json', json, err1 => {
      if (err1) console.error(err1.message);
      console.log('Заметка удалена');
    })
  });
}

