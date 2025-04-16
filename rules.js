
var isBeingChased = false;
var hasCrowBar = false;



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
        
        if(locationData.Choices && locationData.Choices.length > 0) { // TODO: check if the location has any Choices
            if(locationData.Place == "Leopard") {
                isBeingChased = true;
            }
            if (locationData.QuickTime == "Quick") {
                this.engine.addChoice("Quickly grab onto the pole", { Text: "Quickly grab onto the pole ", Target: "OceanEnd"});
            }
            if(locationData.Place == "Mount" && isBeingChased == true) {
                this.engine.addChoice("Run towards the beach where the Boats are", { Text: "Run towards the beach where the boats are", Target: "Beach" });
            }
            for(let choice of locationData.Choices) {
                // TODO: loop over the location's Choices
                this.engine.addChoice(choice.Text, choice); // TODO: use the Text of the choice
                 // TODO: add a useful second argument to addChoice so that the current code of handleChoice below works
            }
        } else {
            this.engine.addChoice("The end?")
        }
    }

    handleChoice(choice) {
        if(choice) {
            this.engine.show("&gt; "+choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } else if(locationData.Place == "Dead") {
            this.engine.gotoScene(End);
        } else if(choice && choice.Text == "Go towards the clearing" && isBeingChased == true) {
            this.engine.gotoScene(Location, this.engine.storyData.Locations.LeopardDeath);
        } else {
            this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show("<h2>The End</h2>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');