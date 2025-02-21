const title = new URL(window.location.href).searchParams.get('title');
let content = '';
const contentBox = document.getElementById('content');
const func = /\(\(([^()]+)\)\)/;
const temp = /\{\{(틀:[^{}]+)\}\}/;
const tempVar = /<<([^<>]+)>>/;
let tempVars = {};

async function setContent(){
    const response1 = await fetch(`https://raw.githubusercontent.com/idzogy/wiki/main/docs/${title}.md`);
    content = await response1.text();
    
    // templates
    while(temp.test(content)){
        tempVars = {};
        
        let match = content.match(temp)[1].replaceAll('\n', '');
        
        while(match.includes('|')){
            match = match.replace(/\|([^|=]+)=([^|=]+)/, (m, variable, value) => {tempVars[variable] = value;return '';});
        }
        
        const response2 = await fetch(`https://raw.githubusercontent.com/idzogy/wiki/main/docs/${match}.md`);
        let replacing = await response2.text();
        
        while(tempVar.test(replacing)){
            replacing = replacing.replace(tempVar, (m, p1) => tempVars[p1] || '');
        }
        
        while(func.test(replacing)){
            replacing = replacing.replace(func, (m, p1) => new Function(`return ${p1}`)())
        }
        
        content = content.replace(temp, replacing);
    }
    
    // functions
    while(func.test(content)){
        content = content.replace(func, (match, p1) => new Function(`return ${p1}`)());
    }
    
    content = marked.parse(content);
    content = content.replace(/(?<=[^\!])\[\[([^\[\]]+)\]\]/g, `<a href="?title=$1">$1</a>`);
    content = content.replace(/\!\[\[([^\[\]]+)\]\]/g, `<img src="imgs/$1">`);
    content = `<h1>${title}</h1>` + content;
    contentBox.innerHTML = content;
}

setContent();