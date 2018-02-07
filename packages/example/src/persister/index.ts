import simulate from './simulate';

const { saveAs } = require('filesaver.js');
const log = require('debug')('redux-dag-history:FilePersister');

function readJson(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = (err) => {
      log('error reading file', err);
      reject(err);
    };
    reader.onloadend = () => {
      log('read loadend', reader);
      const { result } = reader;
      resolve(JSON.parse(result));
    };
    reader.readAsText(file);
  });
}

export function save(history) {
  const blob = new Blob([JSON.stringify(history)], { type: 'text/plain;charset=utf-8' });
  try {
    saveAs(blob, 'visual.history');
  } catch (err) {
    log('Error Saving History', err);
  }
}

export function load() {
  log('Loading...', Promise);
  return new Promise((resolve) => {
    log('Loading... (in promise)');
    const pickerElem = document.getElementById('pickFileInput');
    pickerElem.addEventListener('change', function handleChange() {
      this.removeEventListener('change', handleChange, false);
      log('Loading... on change!');
      const file = this['files'][0];
      log('history file selected', file);
      resolve(readJson(file));
    });
    simulate(document.getElementById('pickFileInput'), 'click');
  });
}
