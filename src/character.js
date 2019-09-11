export class Character {
  getCharacter() {
    return new Promise(function(resolve, reject) {
      let request = new XMLHttpRequest();
      let id = Math.ceil(Math.random()*183);
      const url = `https://rickandmortyapi.com/api/character/${id}`;
      request.onload = function() {
        if (this.status === 200) {
          resolve(request.response);
        } else {
          reject(Error(request.statusText));
        }
      }
      request.open("GET", url, true);
      request.send();
    });
  }
}
