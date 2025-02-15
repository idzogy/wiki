const title = new URL(window.location.href).searchParams.get('title');
let content = '';
const contentBox = document.getElementById('content');
const reg = /\{\{(틀:[^{}]+)\}\}/;

async function setContent(){
    const response1 = await fetch(`https://raw.githubusercontent.com/idzogy/wiki/main/docs/${title}.md`);
    content = await response1.text();
    
    // templates
    while(reg.test(content)){
        const match = content.match(reg)[1];
        const response2 = await fetch(`https://raw.githubusercontent.com/idzogy/wiki/main/docs/${match}.md`);
        const replacing = await response2.text();
        
        content = content.replace(reg, replacing)
    }
    
    content = marked.parse(content);
    content = content.replace(/(?<=[^\!])\[\[([^\[\]]+)\]\]/g, `<a href="?title=$1">$1</a>`);
    content = content.replace(/\!\[\[([^\[\]]+)\]\]/g, `<img src="imgs/$1">`);
    content = `<h1>${title}</h1>` + content;
    contentBox.innerHTML = content;
}

setContent();