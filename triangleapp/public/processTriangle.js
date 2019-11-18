

const errorMessages = {
    FieldMissing : "This field cannot be empty",
    NumberInvalid : "Please enter a number greater than 0"
}

const ids = {
    n1 : "number1",
    n2 : "number2",
    n3 : "number3"
}

const errorIds={
    n1:"errnum1",
    n2:"errnum2",
    n3:"errnum3"
}

 
function validateInputs()
{
    
    var num1 = parseFloat(document.getElementById(ids.n1).value);
    var num2 = parseFloat(document.getElementById(ids.n2).value);
    var num3 = parseFloat(document.getElementById(ids.n3).value);
    removeErrorMessages()
    
    if (!num1 || num1<=0 || !num2 || num2<=0 || !num3 || num3<=0){
        
        if(!num1){
            getTheErrorMessageOnInputs(ids.n1,errorMessages.FieldMissing,errorIds.n1);    
        }
        else if (num1 <=0){
            getTheErrorMessageOnInputs(ids.n1,errorMessages.NumberInvalid,errorIds.n1);
        }
    
        if(!num2){
            getTheErrorMessageOnInputs(ids.n2,errorMessages.FieldMissing,errorIds.n2);  
        }
        else if(num2<=0){
            getTheErrorMessageOnInputs(ids.n2,errorMessages.NumberInvalid, errorIds.n2);
        }

        if(!num3){
            getTheErrorMessageOnInputs(ids.n3,errorMessages.FieldMissing, errorIds.n3);    
        }
        else if(num3<=0){
            getTheErrorMessageOnInputs(ids.n3,errorMessages.NumberInvalid, errorIds.n3);
        }
    }
    
    else{
        processSubmit(num1,num2,num3);
    } 
}


function removeErrorMessages()
{
    var numerr1 = document.getElementById(errorIds.n1);
    var numerr2 = document.getElementById(errorIds.n2);
    var numerr3 = document.getElementById(errorIds.n3);

    if(numerr1){
        numerr1.remove()
    }
    if(numerr2){
        numerr2.remove()
    }
    if(numerr3){
        numerr3.remove()
    }
}



function getTheErrorMessageOnInputs(currentId, message, newId)
{
        var div = document.getElementById(currentId);

        var dl = document.createElement("dl"); 
        dl.className="ts-errors";
        dl.id=newId;
        
        var dt=document.createElement("dt");
        dt.appendChild(document.createTextNode("Warning"));

        var dd=document.createElement("dd");
        dd.appendChild(document.createTextNode(message));

        dl.appendChild(dt);
        dl.appendChild(dd);
        div.parentNode.insertBefore(dl, div.nextSibling);
}

function processSubmit(num1,num2,num3)
{
    const triangleObject = new Triangle(num1,num2,num3);
    var type = triangleObject.checkThetype();
    triangleObject.printTheAnswer(type);

    
}

 const typeOfTriangle = 
{
    EQUILATERAL: 'equilateral',
    ISOCELES: 'isoceles',
    SCALENE: 'scalene',
    UNKNOWN: 'unknown'
}


class Triangle 
{
    constructor(num1,num2,num3)
    {
        this.num1 = num1;
        this.num2 = num2;
        this.num3 = num3;
        //this.type = type
    }

    checkTheProperty()
    {
        if(((this.num1 + this.num2) > this.num3) && ((this.num1 + this.num3) > this.num2) && ((this.num2 + this.num3) > this.num1)) {
            console.log("True")
            return true;
        }
        else{
            console.log("False")
            return false
        }
    }

    checkThetype()
    {
        console.log(this.num1,this.num2,this.num3)
        if(!this.checkTheProperty()){
            return typeOfTriangle.UNKNOWN 
        }
        else if(this.num1==this.num2 && this.num2==this.num3){
            return typeOfTriangle.EQUILATERAL
        }
        else if(this.num1==this.num2 || this.num2==this.num3 || this.num3==this.num1){
            return typeOfTriangle.ISOCELES
        }
        else{
            return typeOfTriangle.SCALENE
        }

    }


    printTheAnswer(type)
    {
        const resultMessage = {
            EQILATERAL :"An equilateral triangle is a triangle in which all three sides are equal.It is also equiangular; that is, all three internal angles are also congruent to each other and are each 60°. It is also a regular polygon, so it is also referred to as a regular triangle.",
            ISOCELES : "An isosceles triangle is a triangle that has two sides of equal length. Sometimes it is specified as having exactly two sides of equal length, and sometimes as having at least two sides of equal length, the latter version thus including the equilateral triangle as a special case.",
            SCALENE: "A scalene triangle has all sides of different lengths.",
            UNKNOWN: "This triangle does not satisfy the important property of a triangle which is the The sum of the length of any two sides of a triangle is greater than the length of the third side. "
        }

        var paragraph=document.getElementById("triangleMessage");
        if(paragraph){
            paragraph.remove();
        }

        paragraph = document.createElement("p");
        paragraph.id="triangleMessage"
        var h2 =  document.createElement("h2")
        var h1 = document.createElement("h5");
        paragraph.appendChild(h2)
        paragraph.appendChild(h1);
        
        if(type==typeOfTriangle.EQUILATERAL)
        {
            h2.appendChild(document.createTextNode("Equilateral Triangle"))
            var text = document.createTextNode(resultMessage.EQILATERAL)
            h1.appendChild(text)
        }
        else if(type==typeOfTriangle.ISOCELES)
        {
            h2.appendChild(document.createTextNode("Isoceles Triangle"))
            var text = document.createTextNode(resultMessage.ISOCELES)
            h1.appendChild(text)

        }
        else if(type==typeOfTriangle.SCALENE)
        {
            h2.appendChild(document.createTextNode("Scalene Triangle"))
            var text = document.createTextNode(resultMessage.SCALENE)
            h1.appendChild(text)
        }
        else{
            h2.appendChild(document.createTextNode("Not A Triangle"))
            var text = document.createTextNode(resultMessage.UNKNOWN)
            h1.appendChild(text)
        }


        var div = document.getElementById("modalDiv");
        div.appendChild(paragraph);
        ts.ui.get('#microModal').open();
    }

    
}
module.exports=Triangle