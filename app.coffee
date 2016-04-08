{ViewNavigationController} = require "ViewNavigationController"

bg = new BackgroundLayer
vnc = new ViewNavigationController

vnc.animationOptions =
	curve: "ease-in-out"
	time: 0.3

# Import file "Start screen"
psd = Framer.Importer.load("imported/Start screen@1x")

psd.startScreen.name = "initialView"
psd.startScreen.superLayer = vnc

homeView = new Layer
	width: Screen.width
	height: Screen.height
	backgroundColor: "#FCFAED"
	superLayer: vnc
	
psd.sveaButton.on Events.Click, ->
	vnc.transition homeView