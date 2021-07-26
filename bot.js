

const opts = {
    identity: {
    //Usuario de Twitch o de la cuenta de la cual vas a comentar
      username: "TuUsuario",
      //Obtener la contraseña de aqui  https://twitchapps.com/tmi/
      password: "oauth:password"
    },
    channels: [
        //Canales donde va estar escuchando el Chatbot.
        //El nombre de tu canal como aparece despues del https://www.twitch.tv/{el nombre}
      "TuCanal",
    ]
  };
  
  // Create a client with our options
  const client = new tmi.client(opts);
  
  // Register our event handlers (defined below)
  client.on('message', onMessageHandler);
  client.on('connected', onConnectedHandler);
  client.on('cheer', onCheer);
  // Connect to Twitch:
  client.connect();
  
  function onCheer(target, context, msg, self){
    if(app.gameStarted){
      app.bits = parseInt(app.bits) + parseInt(context.bits);
      app.resbits = parseInt(app.resbits) + parseInt(context.bits);
      client.say(target, `Gracias por tu contribución! ${context["display-name"]}`);
      while(parseInt(app.resbits) >= parseInt(app.minbits)){
        let num = Math.floor(Math.random() * 4)+1;
        switch (num){
          case 1:
            app.strength += app.luck;
            app.damage = (app.strength * 1) + app.weaponDamage;
            //client.say(target, `Aumento de daño conseguido!`);
            break;
          case 2:
            app.speed += app.luck;
            //client.say(target, `Aumento de velocidad conseguido!`);
            break;
          case 3:
            app.intelligence += app.luck;
            //client.say(target, `Aumento de experiencia consegido!`);
            break;
          case 4:
            app.luck += 1;
           // client.say(target, `Que suerte!, aumenta tu suerte!`);
            break;
        }
        app.resbits = parseInt(app.resbits) - parseInt(app.minbits);
      }
    }
  }

  // Called every time a message comes in
  function onMessageHandler (target, context, msg, self) {
    if (self) { return; } // Ignore messages from the bot    
    
    // Remove whitespace from chat message
    const commandName = msg.trim().toLowerCase();

    //Pon las funciones de los comandos a habilitar
    //rollDice(target, context, commandName);
    if(commandName === "!punch" || commandName === "blacklivesmatter"  || commandName === "!a"|| commandName === "sabaping"){
        if(!app.shoppingPhase){
          app.punch();
          if(app.enemiesDefeated == app.enemiesPerStage -1 && app.stage == app.finalStage && !app.mensageBoos){
            client.say(target, `Woow llegaron al Jefe final, pero lo lograran con solo ${app.minutes} : ${app.seconds} minutos?`);
            app.mensageBoos = true;
          } 
        }
        else if(app.gameStarted && app.shoppingPhase){
          client.say(target, `Hora de votar con !up [1,2,3] `);
        }
    }

    if(/^!up [1-3]/.test(commandName) ){
      if(app.shoppingPhase){
          const numv = parseInt(commandName.match(/([1-3])/)[0]) - 1;
          if(numv <= 2){
            app.votes[numv] =  parseInt(app.votes[numv]) + 1;
            if(app.xp >= app.upgrades[numv].cost){
              if(app.votes[numv] >= app.minvotes){
                client.say(target, `Compra realizada!`);
                app.nBuy(numv);
                app.votes[numv] = 0;
                if(app.xp < app.upgrades[0].cost && app.xp < app.upgrades[1].cost && app.xp < app.upgrades[2].cost){                
                  app.exitShoppingPhase();
                  app.votes[0] = 0;
                  app.votes[1] = 0;
                  app.votes[2] = 0;
                  client.say(target, `Hora de !punch BlackLivesMatter SabaPing`);
                }
              }
            }else{
              app.votes[numv] = 0;
            }
        }
      }
    }
    
    if(/^!start/.test(commandName)){
      console.log(context)
      if(context.badges)
        if(context.badges.broadcaster){
          if(app.introClicked){
            app.startGame();
            client.say(target, `Hora de !punch BlackLivesMatter SabaPing`);
            app.introClicked = false;
          }else{
            app.introClicked = true;
          }
        }
    }

    if(/^!restart/.test(commandName)){
      console.log(context)
      if(context.badges)
        if(context.badges.broadcaster){
          location.reload(true);
        }
    }

  }
 
  // Called every time the bot connects to Twitch chat
  function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
  }