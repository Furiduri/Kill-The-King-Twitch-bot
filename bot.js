

const opts = {
    identity: {
    //Usuario de Twitch o de la cuenta de la cual vas a comentar
      username: "UsuarioTwitch",
      //Obtener la contraseña de aqui  https://twitchapps.com/tmi/
      password: "oauth:Contraseña_conseguida_del_Link"
    },
    channels: [
        //Canales donde va estar escuchando el Chatbot.
        //El nombre de tu canal como aparece despues del https://www.twitch.tv/{el nombre}
      "Tu_Canal"
    ]
  };
  
  // Create a client with our options
  const client = new tmi.client(opts);
  
  // Register our event handlers (defined below)
  client.on('message', onMessageHandler);
  client.on('connected', onConnectedHandler);
  client.on('cheer', onCheer);
  client.on("subscription", onSubscription);
  client.on("resub", onResub );
  client.on("subgift", onSubGift );
  client.on("anongiftpaidupgrade", onSubGiftAnon );
  client.on("hosted", onHosted );
  // Connect to Twitch:
  client.connect();
  
  function onCheer(target, context, msg, self){
    if(app.gameStarted && !app.gameover){
      app.bits = parseInt(app.bits) + parseInt(context.bits);
      app.resbits = parseInt(app.resbits) + parseInt(context.bits);
      client.say(target, `Gracias por tu contribución! ${context["display-name"]}`);
      while(parseInt(app.resbits) >= parseInt(app.minbits)){
        let num = Math.floor(Math.random() * 4)+1;
        switch (num){
          case 1:
            app.strength += app.luck;
            app.damage = (app.strength * 1) + app.weaponDamage;
            client.say(target, `Creo que alguien fue al Gym, a aumentar tu fuerza!`);
            break;
          case 2:
            app.speed += app.luck;
            client.say(target, `Aumenta tu velocidad, Un poco mas y alcanzas a Flash!`);
            break;
          case 3:
            app.intelligence += app.luck;
            client.say(target, `Aprendes rapido, y por ello compraras mas cada ronda!`);
            break;
          case 4:
            app.luck += 1;
            client.say(target, `Que suerte!, aumenta tu suerte!`);
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
    rollDice(target, context, commandName);
    if(commandName === "!punch" || commandName === "blacklivesmatter"  || commandName === "!a"|| commandName === "sabaping"){
        if(!app.shoppingPhase && app.canAttack){
          app.punch();
          if(app.enemiesDefeated == app.enemiesPerStage -1 && app.stage == app.finalStage && !app.mensageBoos){
            client.say(target, `Woow llegaron al Jefe final, pero lo lograran con solo ${app.minutes} : ${app.seconds} minutos?`);
            app.mensageBoos = true;
          } 
        }
        else if(app.gameStarted && app.shoppingPhase){
          client.say(target, `Hora de votar con !up [1,2,3] `);
        } else if (app.gameover){ //Perdieron
          client.say(target, `F en el chat BibleThump `);
        } else if (app.gamewin){ // Ganaron
          client.say(target, `Yupi!, el chat ha ganado! PogChamp `);
        }
    }

    if(/^!up [1-3]/.test(commandName) ){
      if(app.shoppingPhase && app.gameStarted){
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

  // Funcion de nueva subscription
  function onSubscription (target, username, methods){
    if(app.gameStarted && !app.gameover){
      let num = Math.floor(Math.random() * 4)+1;
      switch (num){
        case 1:
          app.strength += app.luck;
          app.damage = (app.strength * 1) + app.weaponDamage;
          client.say(target, `Creo que alguien fue al Gym, a aumentar tu fuerza!`);
          break;
        case 2:
          app.speed += app.luck;
          client.say(target, `Aumenta tu velocidad, Un poco mas y alcanzas a Flash!`);
          break;
        case 3:
          app.intelligence += app.luck;
          client.say(target, `Aprendes rapido, y por ello compraras mas cada ronda!`);
          break;
        case 4:
          app.luck += 1;
          client.say(target, `Que suerte!, aumenta tu suerte!`);
          break;
      }
    }
  }

  // Funcion de Re subscription
  function onResub(target, username, months, message, userstate, methods) {
    if(app.gameStarted && !app.gameover){
      let num = Math.floor(Math.random() * 4)+1;
      switch (num){
        case 1:
          app.strength += app.luck;
          app.damage = (app.strength * 1) + app.weaponDamage;
          client.say(target, `Creo que alguien fue al Gym, a aumentar tu fuerza!`);
          break;
        case 2:
          app.speed += app.luck;
          client.say(target, `Aumenta tu velocidad, Un poco mas y alcanzas a Flash!`);
          break;
        case 3:
          app.intelligence += app.luck;
          client.say(target, `Aprendes rapido, y por ello compraras mas cada ronda!`);
          break;
        case 4:
          app.luck += 1;
          client.say(target, `Que suerte!, aumenta tu suerte!`);
          break;
      }      
    }
  }    

  function onSubGift(target, username, methods, recipient){
    if(app.gameStarted && !app.gameover){
      let num = Math.floor(Math.random() * 4)+1;
      switch (num){
        case 1:
          app.strength += app.luck;
          app.damage = (app.strength * 1) + app.weaponDamage;
          client.say(target, `Creo que alguien fue al Gym, a aumentar tu fuerza!`);
          break;
        case 2:
          app.speed += app.luck;
          client.say(target, `Aumenta tu velocidad, Un poco mas y alcanzas a Flash!`);
          break;
        case 3:
          app.intelligence += app.luck;
          client.say(target, `Aprendes rapido, y por ello compraras mas cada ronda!`);
          break;
        case 4:
          app.luck += 1;
          client.say(target, `Que suerte!, aumenta tu suerte!`);
          break;
      }      
    }
  }
  
  function onSubGiftAnon(target, username, methods){
    if(app.gameStarted && !app.gameover){
      let num = Math.floor(Math.random() * 4)+1;
      switch (num){
        case 1:
          app.strength += app.luck;
          app.damage = (app.strength * 1) + app.weaponDamage;
          client.say(target, `Creo que alguien fue al Gym, a aumentar tu fuerza!`);
          break;
        case 2:
          app.speed += app.luck;
          client.say(target, `Aumenta tu velocidad, Un poco mas y alcanzas a Flash!`);
          break;
        case 3:
          app.intelligence += app.luck;
          client.say(target, `Aprendes rapido, y por ello compraras mas cada ronda!`);
          break;
        case 4:
          app.luck += 1;
          client.say(target, `Que suerte!, aumenta tu suerte!`);
          break;
      }      
    }
  }

  function onHosted(target, username, cantViewers){
    if(app.gameStarted && !app.gameover){
      client.say(target, `Gracias ${username}, por tu ayuda!`)
      for (let index = 0; index < cantViewers; index++) {
        let num = Math.floor(Math.random() * 4)+1;
        switch (num){
          case 1:
            app.strength += app.luck;
            app.damage = (app.strength * 1) + app.weaponDamage;
            //client.say(target, `Creo que alguien fue al Gym, a aumentar tu fuerza!`);
            break;
          case 2:
            app.speed += app.luck;
            //client.say(target, `Aumenta tu velocidad, Un poco mas y alcanzas a Flash!`);
            break;
          case 3:
            app.intelligence += app.luck;
            //client.say(target, `Aprendes rapido, y por ello compraras mas cada ronda!`);
            break;
          case 4:
            app.luck += 1;
            //client.say(target, `Que suerte!, aumenta tu suerte!`);
            break;
        }
      }
    }
  }

  // Called every time the bot connects to Twitch chat
  function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
  }