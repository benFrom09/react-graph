
 export const plotterParser = (func = '') => {

    const dictionnary = new Map();
    dictionnary.set('sqrt','Math.sqrt');
    dictionnary.set('exp','Math.exp');
    dictionnary.set('log','Math.log');
    dictionnary.set('cos','Math.cos');
    dictionnary.set('sin','Math.sin');
    dictionnary.set('tan','Math.tan');


    //console.log(dictionnary);
    let ex = func;
    
    for(let k of dictionnary) {
       let n = ex.replace(k[0],k[1]);
       ex = n;
    }
    return ex;
  
    
}





