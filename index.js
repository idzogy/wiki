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
    contentBox.innerHTML+=`${str}`;
    const response = await fetch(`https://raw.githubusercontent.com/idzogy/wiki/main/docs/${str}.md`);
    return await response.text();
}


async function readTemplates(str) {
    const reg = /\{\{(틀:[^{}]+)\}\}/;
    contentBox.innerHTML+='reading started';
    while(str.match(reg)) {
        contentBox.innerHTML+=`match:${str.match(reg)[0]}`;
        const replacing = await getContent(str.match(reg)[1]);
        str = str.replace(str.match(reg)[0], replacing);
    }
    
    return str;
}

setContent();