function derivatives(expression,variable){
    variable.toLowerCase();

    
    //constant derivative = 0
    //elemnetaty Power rules  d/dx(f(x)^c = c * f'(x) * f(x)^(c-1))
    //f(x - E)^c - f(x)^c / E
    //2 * 1 * x^1

    let parseVar = 1;
    let parseConstant = 0;

    expression = expression.replaceAll(variable,'(1 * x)');
    console.log(expression);
    
};






derivatives('2*x*x','x');