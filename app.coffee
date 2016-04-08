{ViewNavigationController} = require "ViewNavigationController"

bg = new BackgroundLayer
vnc = new ViewNavigationController

vnc.animationOptions =
	curve: "ease-in-out"
	time: 0.3
	
# Import file "Start screen"
psd = Framer.Importer.load("imported/Start screen@1x")

#This is the initial view 
psd = new Layer
	name: "initialView"
	width: Screen.width
	height: Screen.height
	superLayer: vnc

#This is the second view that should be accessed when pressing Svevägen
homeView = new Layer
	width: Screen.width
	height: Screen.height
	backgroundColor: "#FCFAED"
	superLayer: vnc

btnHome = new Layer
	width: Screen.width
	height: Screen.height/3
	backgroundColor: "transparent"
	superLayer: psd
	
btnHome.on Events.Click, ->
	vnc.transition homeView