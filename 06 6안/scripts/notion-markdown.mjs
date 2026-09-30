// Notion's enhanced Markdown serializes sibling blocks on consecutive lines.
// Add parser boundaries without editing any words in the saved manuscript.
export function notionBlockBoundaries(markdown) {
  const lines=markdown.split('\n');
  let output='',table=false,fence=false;
  for(const raw of lines) {
    const line=raw.replace(/^\t+/,tabs=>'    '.repeat(tabs.length));
    if(/^```/.test(line)) {fence=!fence;output+=line+'\n';if(!fence)output+='\n';continue;}
    if(fence) {output+=line+'\n';continue;}
    if(/^<table(?:\s|>)/.test(line))table=true;
    if(table) {
      output+=line+'\n';
      if(line.includes('</table>')) {table=false;output+='\n';}
      continue;
    }
    output+=line+(/ {2,}$/.test(line)?'\n':'\n\n');
  }
  if(table||fence)throw Error('Unclosed Notion table or code block');
  return output;
}

export const notionTable={
  name:'notionTable',level:'block',
  start:src=>src.indexOf('<table'),
  tokenizer(src) {
    const match=/^<table\b([^>]*)>([\s\S]*?)<\/table>/.exec(src);
    if(!match)return;
    const attrs=match[1];
    if(attrs.replace(/\s+(?:header-row|header-column|fit-page-width)="(?:true|false)"/g,'').trim())throw Error('Unsupported Notion table attributes');
    const rows=[...match[2].matchAll(/<tr>([\s\S]*?)<\/tr>/g)];
    if(!rows.length||match[2].replace(/<tr>[\s\S]*?<\/tr>/g,'').trim())throw Error('Unsupported Notion table rows');
    const cells=rows.map(row=>{
      const values=[...row[1].matchAll(/<td>([\s\S]*?)<\/td>/g)];
      if(!values.length||row[1].replace(/<td>[\s\S]*?<\/td>/g,'').trim())throw Error('Unsupported Notion table cells');
      return values.map(cell=>this.lexer.inlineTokens(cell[1]));
    });
    if(cells.some(row=>row.length!==cells[0].length))throw Error('Inconsistent Notion table columns');
    return {type:'notionTable',raw:match[0],rows:cells,headerRow:/header-row="true"/.test(attrs),headerColumn:/header-column="true"/.test(attrs)};
  },
  renderer(token) {
    const rows=token.rows.map((row,r)=>'<tr>'+row.map((cell,c)=>{
      const header=token.headerRow&&r===0||token.headerColumn&&c===0;
      const tag=header?'th':'td';
      return `<${tag}${header?' scope="'+(r===0&&token.headerRow?'col':'row')+'"':''}>${this.parser.parseInline(cell)}</${tag}>`;
    }).join('')+'</tr>');
    return '<div class="table-scroll" role="region" aria-label="문법 비교 표" tabindex="0"><table>'+
      (token.headerRow?'<thead>'+rows.shift()+'</thead>':'')+'<tbody>'+rows.join('')+'</tbody></table></div>\n';
  }
};
