const title = new URL(window.location.href).searchParams.get('title');
let content = '';
const contentBox = document.getElementById('content');

async function setContent(){
    const response = await fetch(`https://raw.githubusercontent.com/idzogy/wiki/main/docs/${title}.md`);
    content = await response.text();
    content = marked.parse(content);
    content = content.replace(/(?<=[^\!])\[\[([^\[\]]+)\]\]/g, `<a href="?title=$1">$1</a>`);
    content = content.replace(/\!\[\[([^\[\]]+)\]\]/g, `<img src="imgs/$1">`);
    content = `<h1>${title}</h1>` + content;
    contentBox.innerHTML = content;
}

setContent();