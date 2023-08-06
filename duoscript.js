// ==UserScript==
// @name        Duolingo Resposta Automatica
// @match       https://www.duolingo.com/*
// @grant       none
// @version     2.0
// @author      @jackZacarias
// @description 12/21/2023, 6:35:07 PM
// Esse script vai resolver todas as questão de escuta, em treinameto, assim dando apenas xp e não atrapalhando a trilha da pessoa 
// Para executar o script no console, aperte F12, e cole o script no console e aperte enter, e pronto só se divertir, .
// Considerações o script já existia porem não funcionava mais, eu implementei novos tratamento atualizei e crei uma loop, para não precisar fica entrando toda hora.
// ==/UserScript==
 
 
function addButtons(time){
 
  setTimeout(()=>{
    let original = document.querySelectorAll('[data-test="player-next"]')[0];
    let wrapper = document.getElementsByClassName('_10vOG')[0];
    
    wrapper.style.display = "flex"
 
    let solveCopy = document.createElement('button');
    let pauseCopy = document.createElement('button');
 
    solveCopy.innerHTML = 'Responder tudo';
    solveCopy.disabled = false;
    pauseCopy.innerHTML = 'Responder';
    
    const buttonStyle = `
        min-width: 150px;
        font-size: 17px;
        border:none;
        border-bottom: 4px solid #58a700;
        border-radius: 18px;
        padding: 13px 16px;
        transform: translateZ(0);
        transition: filter .2s;
        font-weight: 700;
        letter-spacing: .8px;
        background: #55CD2E;
        color:#fff;
        margin-left:20px;
        cursor:pointer;
       `
    
    solveCopy.style.cssText = buttonStyle
    pauseCopy.style.cssText = buttonStyle
  
    
    function mouseOver(x){
      x.style.filter = "brightness(1.1)"
    }
    
    function mouseLeave(x){
      x.style.filter = "none"
    }
    
    let buttons = [solveCopy,pauseCopy]
    
    buttons.forEach(button => {
      button.addEventListener("mousemove", () => {
      mouseOver(button)
      })
    })
    
    buttons.forEach(button => {
      button.addEventListener("mouseleave", () => {
      mouseLeave(button)
      })
    })
    

       
    original.parentElement.appendChild(pauseCopy);
    original.parentElement.appendChild(solveCopy);
    
 
    solveCopy.addEventListener('click', startSolving);
    pauseCopy.addEventListener('click', solve);
  }, time || 2000);
 
}
 
addButtons(3000);
 
 
var intervalId;
 
function startSolving(){
  if(intervalId)
    return;
  intervalId = setInterval(solve, 500);
}
 
function pauseSolving(){
  if(!intervalId)
    return;
  clearInterval(intervalId);
  intervalId = undefined;
}


function clickButton() {
  // Verifica se a URL atual não é a URL da prática de escuta
  if (window.location.href !== 'https://www.duolingo.com/practice-hub/listening-practice') {
    let buttonSelector = '._3_OWE';
    let buttons = Array.from(document.querySelectorAll(buttonSelector));
    let button = buttons.find(button => button.textContent.trim() === 'Escuta');
    if (button) {
      button.click();
      console.log('Botão clicado.');
    } else {
      console.error('Botão não encontrado.');
    }
  } else {
    console.log('Está em uma lição de escuta, o botão não será clicado.');
  }
}

function clickContinueButton() {
  let continueButton = document.querySelector("[data-test='player-next']");
  if (continueButton && continueButton.innerText.toLowerCase() === 'continuar') {
      continueButton.click();
  }
}
 
function solve() {
  let reactComponent = FindReact(document.getElementsByClassName('_3FiYg')[0]);

if (reactComponent == null) {

    console.log("Nao deu certo ele é nullo ")
    clickContinueButton();
    
    setTimeout(clickButton, 4000);
    // Implemente algum comportamento quando reactComponent for nulo.
    return;
}

window.sol = reactComponent.props.currentChallenge;
if(!window.sol) return;
    let btn = null;
 
    let selNext     = document.querySelectorAll('[data-test="player-next"]');
    let selAgain    = document.getElementsByClassName('_3_pD1 _2ESN4 _2arQ0 _2vmUZ _2Zh2S _1X3l0 eJd0I _3yrdh _2wXoR _1AM95 _1dlWz _2gnHr _2L5kw _3Ry1f')
 
    if ( selAgain.length === 1 ) {
        // Certifique-se de que é o botão `praticar novamente`
        if( selAgain[0].innerHTML.toLowerCase() === 'practice again' ) {
           // provavelmente esse botão não vai ter se você for pt-BR 
            selAgain[0].click();
 
            // Terminate
            return;
        }
    }
 
    if( selNext.length === 1 ) {
        // Salva o elemento do botão
        btn = selNext[0];
 
        if( document.querySelectorAll('[data-test="challenge-choice"]').length > 0 ) {
            if(sol.correctIndices){
              window.sol.correctIndices.forEach( index => {
                document.querySelectorAll('[data-test="challenge-choice"]')[index].children[0].click()
              })            
            // Clique no primeiro elemento
            }else{
               document.querySelectorAll('[data-test="challenge-choice"]')[window.sol.correctIndex].click()
            }
            // Clique no botão resolver
            btn.click();
        }
 
       if( document.querySelectorAll('[data-test="challenge-choice-card"]').length > 0 ) {
            
            if(sol.correctIndices){
              window.sol.correctIndices.forEach( index => {
                document.querySelectorAll('[data-test="challenge-choice-card"]')[index].children[0].click()
              })
            }else{
               document.querySelectorAll('[data-test="challenge-choice-card"]')[window.sol.correctIndex].click()
            }
            
            btn.click();
        }
 
        if( document.querySelectorAll('[data-test="challenge-tap-token"]').length > 0 ) {
            
          clicked = {}
            window.sol.correctIndices.forEach(index => {
              let correctAnswer = window.sol.choices[index].text;
              let nl =  document.querySelectorAll('[data-test="challenge-tap-token"]');
              for(let i = 0; i < nl.length; i++){
                if( (nl[i].innerText).toLowerCase().trim() == correctAnswer.toLowerCase().trim() && !nl[i].disabled){
                  clicked[i] = 1;
                  nl[i].click();
                  break;
                }
              }
            });
            
            btn.click();
        }
 
        if( document.querySelectorAll('[data-test="challenge-text-input"]').length > 0 ) {
 
            let elm = document.querySelectorAll('[data-test="challenge-text-input"]')[0]
            let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
            nativeInputValueSetter.call(elm, window.sol.correctSolutions ? window.sol.correctSolutions[0] : (window.sol.displayTokens ? window.sol.displayTokens.find(t => t.isBlank).text  : window.sol.prompt));              
            let inputEvent = new Event('input', { bubbles: true});
 
            elm.dispatchEvent(inputEvent);
        }
 
        if( document.getElementsByTagName('textarea').length > 0 ) {
            let elm = document.getElementsByTagName('textarea')[0]
 
            let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
            nativeInputValueSetter.call(elm, window.sol.correctSolutions ? window.sol.correctSolutions[0] : window.sol.prompt);
 
            let inputEvent = new Event('input', { bubbles: true});
 
            elm.dispatchEvent(inputEvent);
        }
        clickContinueButton();
        if (btn) btn.click();
        // Continue
        btn.click();
    } 
}
 
function FindReact(dom, traverseUp = 0) {
  if (dom && dom.parentElement) {
      const key = Object.keys(dom.parentElement).find(key=>key.startsWith("__reactProps$"));
      if (dom.parentElement[key] && dom.parentElement[key].children && dom.parentElement[key].children[0] && dom.parentElement[key].children[0]._owner) {
        return dom.parentElement[key].children[0]._owner.stateNode;
      } else {
        return null;
      }
  } else {
      // O elemento não existe, retorne nulo ou tome outra ação.
      return null;
  }
}
 
window.findReact = FindReact;
 
window.ss = startSolving;
 
