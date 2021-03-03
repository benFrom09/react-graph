import React, { Component } from 'react'
import {plotterParser} from './modules/plotterParser';
import { round } from './modules/helpers'
import './graph.scss';
export default class Graph extends Component {
    constructor(props) {
        super(props);
        this.canvas = React.createRef();
        this.mousePosPopUp = React.createRef();
        this.state = {
            ctx:null,
            rect:null,
            width:this.props.width,
            height:this.props.height,
            xMinValue: this.props.xMinValue ? this.props.xMinValue : -4 ,
            xMaxValue:this.props.xMaxValue ? this.props.xMaxValue : 4,
            yMinValue: this.props.yMinValue ? this.props.yMinValue : -4 ,
            yMaxValue:this.props.yMaxValue ? this.props.yMaxValue :4,
            mousePos:{
                x:null,
                y:null,
                xRelative:null,
                yRelative:null
            },
            mouseInCanvas:false
        };

        this.padding = 40;
        this.graphWidth = this.state.width - this.padding;
        this.graphHeight = this.state.height - this.padding;

        //range of x and y value
        this.xRange = this.state.xMaxValue - this.state.xMinValue;
        this.yRange = this.state.yMaxValue - this.state.yMinValue;

        this.scaleX = this.graphWidth  / this.xRange;
        this.scaleY = this.graphHeight  / this.yRange;

        //relative coordinate
        this.xMaxRelative = this.state.xMaxValue * this.scaleX;
        this.xMinRelative = this.state.xMinValue * this.scaleX;

        
        this.yMaxRelative = this.state.yMaxValue * this.scaleY;
        this.yMinRelative = this.state.yMinValue * this.scaleY;

        this.xOrigin = Math.round(Math.abs(this.state.xMinValue / this.xRange * this.graphWidth)) + this.padding / 2;
        this.yOrigin = Math.round(Math.abs(this.state.yMaxValue / this.yRange * this.graphHeight)+ this.padding / 2);

        //real coordinate
        this.xMin = this.xOrigin + this.xMinRelative;
        this.xMax = this.xOrigin + this.xMaxRelative;

        this.yMin = this.yOrigin - this.yMinRelative;
        this.yMax = this.yOrigin - this.yMaxRelative;
        console.log(this);

        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);

    }
    componentDidMount() {
        console.log('ComponentDidMount');
        this.setState({ctx:this.canvas.current.getContext('2d'),rect:this.canvas.current.getBoundingClientRect()},() => {
            //console.log('hello');
            this.drawGrid();
            this.drawAxes();   
        });
        
       
        
    }
    componentDidUpdate(prevProps,prevState) {
        console.log('ComponentDidUpdate');
        //this.drawAxes();
        console.log(this.props.func);
        if(prevProps.func !== this.props.func) {
            this.state.ctx.clearRect(0,0,this.state.width,this.state.height);
            this.drawGrid();
            this.drawAxes();
            try {
                
                //eslint-disable-next-line
                this.plot((x) => eval(plotterParser(this.props.func)),true,false);
            } catch (error) {
                return;
            }
        }
        
        
    }
    handleMouseMove(e) {
        const { width,height,rect} = this.state; 
       
       this.setState(prevState => ({
           mousePos:{
                x:Math.floor((e.clientX - rect.left)/(rect.right - rect.left) * width - this.padding / 2) ,
                y:Math.floor((e.clientY - rect.top)/(rect.bottom - rect.top) * height - this.padding / 2),
               xRelative:(((e.clientX - rect.left)/(rect.right - rect.left) * width - this.padding / 2 - this.xMaxRelative)/ this.scaleX ).toFixed(1),
               yRelative:-(((e.clientY - rect.top)/(rect.bottom - rect.top) * height - this.padding / 2 + this.yMinRelative)/this.scaleY).toFixed(1)
           }
       }));
       
    }
    
    handleMouseEnter() {
        this.setState({mouseInCanvas:true});
    }
    handleMouseLeave() {
        this.setState({mouseInCanvas:false});
    }
    drawAxes() {
        const { ctx,xMinValue,yMinValue } = this.state;
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle="#000";
        ctx.lineWidth = 2;

        //draw x
        ctx.moveTo(this.xMin,this.yOrigin);
        ctx.lineTo(this.xMax,this.yOrigin);

        //draw y
        ctx.moveTo(this.xOrigin,this.yMin);
        ctx.lineTo(this.xOrigin,this.yMax);
        //draw origin
        ctx.fillText(0,this.xOrigin + 2,this.yOrigin - 2);
        ctx.stroke();
        ctx.restore();
        //draw ticks 

        ctx.beginPath();
        ctx.lineWidth = 1;
        console.log(this.xMin);
        //draw x ticks
        let xTickValue = xMinValue;
        for(let i = this.xMin; i <= this.xMax; i+= this.scaleX) {
            
            ctx.moveTo(i,this.yOrigin + 4);
            ctx.lineTo(i,this.yOrigin - 4);
            if(xTickValue !== 0) {
                ctx.fillText(xTickValue ,i - 2,this.yOrigin + 12);  
           }
           xTickValue++;
        }
        //draw y ticks
        let yTickValue = -yMinValue;
        
        for(let i = this.yMax; i <= this.yMin; i+= this.scaleY) {
            
            console.log(i);
            ctx.moveTo(this.xOrigin + 4,i);
            ctx.lineTo(this.xOrigin -4 ,i);
            if(yTickValue !== 0) {
                 ctx.fillText(yTickValue ,this.xOrigin + 8,i + 4);  
            }
            yTickValue--;
        }

        ctx.stroke();
        ctx.restore();
    }
    drawBackground() {
        const { ctx } = this.state;
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = 'rgba(0, 7,40, 0.58)';
        ctx.fillRect(this.xMin,this.yMax,this.graphWidth,this.graphHeight);
        ctx.fill();
        ctx.restore();
    }
    drawGrid() {
        const {ctx} = this.state;
       // this.drawBackground();
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "#999999";
        ctx.lineWidth = 2;


        //draw y line grid
        for(let i = this.yMax; i <= this.yMin; i+= this.scaleY ) {
            ctx.moveTo(this.xMin,i);
            ctx.lineTo(this.xMax,i)
        }
        //draw x line grid

        for(let i = this.xMin; i <= this.xMax; i+= this.scaleX ) {
            ctx.moveTo(i,this.yMin);
            ctx.lineTo(i,this.yMax);
        }
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#cccccc";
         //draw y inline grid
         for(let i = this.yMax; i <= this.yMin; i+= this.scaleY / 2 ) {
            ctx.moveTo(this.xMin,i);
            ctx.lineTo(this.xMax,i);
        }
        //draw x inline grid

        for(let i = this.xMin; i <= this.xMax; i+=  this.scaleX / 2 ) {
            ctx.moveTo(i,this.yMin);
            ctx.lineTo(i,this.yMax);
        }

        ctx.stroke();
        ctx.restore();

    }

    plot(callback,line = true,dot = true,color='red') {
        const {ctx,xMaxValue} = this.state;
        console.log('pLOT');
        const x = [];
        const y = [];
        //keep same x range form [xmin to xmax]
        let range = xMaxValue / (xMaxValue * this.scaleX / 2) ;
        console.log('coef to stay in x range',range);
        for (let i = 0; i <= xMaxValue * this.scaleX; i++) {
            //range is to affine the curve
            let value = (i - (xMaxValue * this.scaleX / 2)) * range;
                x.push((value));
                y.push(callback(value));      
        }
        console.log('coordinates of curve',{x,y});
        //ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;

        for(let i = 0 ; i < x.length; i++) {
            let xPos = (this.xOrigin + x[i] * this.scaleX);
            let yPos = this.yOrigin - y[i] * this.scaleY;
            //let the line stay inside the graph
            if(yPos <= this.yMin  && yPos >= this.yMax) {
                if(line) {
                    ctx.lineTo(xPos,yPos);
                    
                } else {
                    ctx.moveTo(xPos,yPos);
                }
    
                if(dot) {
                    ctx.arc(xPos,yPos,1,0,2*Math.PI,true);
                }
            }
            
        }
        ctx.stroke();
    }

    render() {
        const { width, height,mousePos,mouseInCanvas} = this.state;
        return (
            <div>
                <div ref={this.mousePosPopUp} className={`graph-mouse-position-modal ${mouseInCanvas ? 'visible' : ''}`}>
                    <div className="mouse-coords">
                        <span>x-real:{mousePos.x}</span>                    
                        <span>y-real:{mousePos.y}</span>                   
                        <span>x-relative:{mousePos.xRelative}</span>
                        <span>y-relative:{mousePos.yRelative}</span>
                    </div>
                </div>
                <canvas onMouseLeave={this.handleMouseLeave} onMouseEnter={this.handleMouseEnter} onMouseMove={this.handleMouseMove}  width={width} height={height} ref={this.canvas} style={{border:"1px solid black"}} />
            </div>
        )
    }
}
