 
  // Function called when the "dice" command is issued
  function rollDice (target, context, commandName) {   
      
    // If the command is known, let's execute it
    if ( /^!roll d[1-9][0-9]/.test(commandName)) {
        const sides = commandName.match(/([1-9])([0-9])/)[0];
        const num = Math.floor(Math.random() * sides) + 1;
        client.say(target, `Consegiste un ${num}`);
        console.log(`* Executed ${commandName} command`);
      }   
  }  