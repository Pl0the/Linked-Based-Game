
var isBeingChased = false;
var hasCrowBar = false;
var counter = 0;

class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title); // TODO: replace this text using this.engine.storyData to find the story title
        this.engine.addChoice("Wake up?");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); // TODO: replace this text by the initial location of the story
    }
}


class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key]; // TODO: use `key` to get the data object for the current story location
        this.engine.show(locationData.Body); // TODO: replace this text by the Body of the location data
        
        this.currentKey = key;

        if(locationData.InteractiveMechanism === "BoatInteract") {
            this.engine.gotoScene(BoatInteract);
            return;
        }

        if (locationData.Place == "Leopard") {
            isBeingChased = true;
        }

        if (locationData.Place == "Mount" && isBeingChased) {
            this.engine.addChoice("Run towards the beach where the Boats are", 
                { Text: "Run towards the beach where the boats are",Target: "Beach"});
        }
        
        //if(locationData.GiveKey == "Crowbar") {
        //    hasCrowBar = true;
        //}

        if (locationData.Place == "Quick" || locationData.Place == "Reaching") {
            counter += 1;
        
            if (counter < 2) {
                this.engine.addChoice("Try to reach for the pole", 
                    { Text: "Try to reach for the pole", Target: "QuickTime" });
            } else if(counter < 4) {
                this.engine.addChoice("Try again!", 
                    { Text: "try Again!", Target: "QuickTime" });
            } else {
                this.engine.addChoice("Finally grab onto the pole", 
                    { Text: "Finally, grab onto the pole", Target: "OceanEnd" });
            }
        }

        if (locationData.Choices && locationData.Choices.length > 0) {
            for (let choice of locationData.Choices) {
                if (!choice.NeededKey || (choice.NeededKey == "Crowbar" && hasCrowBar)){
                    this.engine.addChoice(choice.Text, choice);
                }
            }
        } else {
            this.engine.addChoice("The end?");
        }
    }

    handleChoice(choice) {
        var currentLocation = this.engine.storyData.Locations[this.currentKey];
        
        if(currentLocation.Place == "Dead") {
            this.engine.gotoScene(End);
            return;
        }

        if(choice) {
            this.engine.show("&gt; "+choice.Text);
        } else {
            this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
        }

        if(this.currentKey == "Mountain" && choice.Target == "Forest" && isBeingChased) {
            this.engine.gotoScene(Location, "LeopardDeath");
            return;
        }

        if(this.currentKey == "Forest" && choice.Target == "Clearing" && isBeingChased) {
            this.engine.gotoScene(Location, "LeopardDeath");
            return;
        }

        if(choice.Target == "WallScene" && choice.Text == "Pick up the Crowbar and continue on"){
            hasCrowBar = true;
        }

        if(choice.Target =="Beach") {
            isBeingChased = false;
        }

        if(choice.Target) {
            this.engine.gotoScene(Location, choice.Target);
        }
    }
}

class BoatInteract extends Scene {
    create(){
        this.engine.show("You approach the boats and lean up against it feeling the breeze in your hair.");

        this.randomMessage = [
            "Birds fly above your head diving into the water for fish.",
            "You neal down and use water to form a little sand castle, you stand back up and admire your creation.",
            "You notice a group pushing a boat into the ocean, you walk over and help them push it out to sea, you return back to the boat.",
            "You look back at the island admiring its lush forest and beauty.",
            "You wipe sweat off your face as the sun beams down on you, your releaved by the breeze.",
            "You find dirftwood and use it to pretend you have a sword, it reminds oyu of something but you can't seem to remember what it was."
        ]

        this.engine.addChoice("Look around...", { Place: "random" });
        this.engine.addChoice("Leave the boat.", { Target: "GoingTowardsForest" });
    }

    showRandomMessage() {
        let randomVal = Math.floor(Math.random() * this.randomMessage.length);
        this.engine.show(this.randomMessage[randomVal]);
    }

    handleChoice(choice) {
        if (choice && choice.Place == "random") {
            this.showRandomMessage();

            this.engine.addChoice("Look around again...", { Place: "random" });
            this.engine.addChoice("Leave the boat.", { Target: "GoingTowardsForest" });
        } else if (choice && choice.Target) {
            this.engine.gotoScene(Location, choice.Target);
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show("<h2>YOU DIED! Thanks for playing!<h2>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');
