const title = new URL(window.location.href).searchParams.get('title');
let content = '';

const contentBox = document.getElementById('content');

async function setContent(){
    content = await getContent(title);
    content = await readTemplates(content);
    content = marked.parse(content);
    content = content.replace(/(?<=[^\!])\[\[([^\[\]]+)\]\]/g, `<a href="?title=$1">$1</a>`);
    content = content.replace(/\!\[\[([^\[\]]+)\]\]/g, `<img src="imgs/$1">`);
    content = `<h1>${title}</h1>` + content;
    contentBox.innerHTML = content;
}

async function getContent(str){
    const response = await fetch(`https://raw.githubusercontent.com/idzogy/wiki/main/docs/${str}.md`);
    return await response.text();
}


async function readTemplates(str) {
    const regex = /\{\{(틀:[^{}]+)\}\}/g;
    let match;
    
    while((match = regex.exec(str)) !== null) {
        const replacing = await getContent(match[1]);
        str = str.replace(match[0], replacing);
        regex.lastIndex = 0;
    }
    
    return str;
}

setContent();