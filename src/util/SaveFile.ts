
export function downloadFile(filename: string, fileContents: string) {
    const element = document.createElement('a');
    
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileContents));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    
    document.body.appendChild(element);
    
    element.click();

    document.body.removeChild(element);
}