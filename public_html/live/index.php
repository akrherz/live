<?php
require_once("../../include/props.php");

$xmppresource = sprintf("NWSChatLive_%s_%s", $_SERVER["REMOTE_ADDR"],
		gmdate("His"));
?>
<html lang='en'>
<head>
	<meta charset="UTF-8"><!-- Ensure our XMPP stuff is UTF-8 as well -->
	<title>NWSChat Live</title>
 <!-- Jquery stuff -->
 <script language='javascript' type='text/javascript' src='/js/jquery.1.9.1.min.js'></script>
 <!-- ExtJS Stuff -->
 <link rel="stylesheet" type="text/css" href="/ext-3.4.1/resources/css/ext-all.css"/>
 <script type="text/javascript" src="/ext-3.4.1/adapter/jquery/ext-jquery-adapter.js"></script>
 <script type="text/javascript" src="/ext-3.4.1/adapter/ext/ext-base.js"></script>
 <script type="text/javascript" src="/ext-3.4.1/ext-all.js"></script>
<script type="text/javascript">
 Ext.BLANK_IMAGE_URL = '/ext-3.4.1/resources/images/default/s.gif';
 Ext.ns("Application");
 Application.DEBUGMODE = <?php echo (isset($_GET["devel"])) ? 'true': 'false'; ?>;
</script>
<?php if (!isset($_REQUEST["nomap"])){ ?>
  <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?sensor=false"></script>
  <script type="text/javascript" src="/js/OpenLayers.js"></script>
  <script type="text/javascript" src="101/<?php echo gmdate('YmdHi'); ?>.js"></script>
<?php } ?>
<script type="text/javascript" src="/js/soundmanager2-jsmin.js"></script>

 <!-- Finally, the app -->
<?php if (isset($_GET["devel"])){ ?>
<script language='javascript' type='text/javascript' src='js/strophe.js'></script>
<script language='javascript' type='text/javascript' src='js/disco.js'></script>
<script type="text/javascript" src="js/overrides.js"></script>
<script type="text/javascript" src="js/CheckColumn.js"></script>
<script type="text/javascript" src="js/LiveViewport.js"></script>
<script type="text/javascript" src="js/MapLegend.js"></script>
<script type="text/javascript" src="js/MUCChatPanel.js"></script>
<script type="text/javascript" src="js/ChatPanel.js"></script>
<script type="text/javascript" src="js/MUCRoomUsers.js"></script>
<script type="text/javascript" src="js/UserColors.js"></script>
<script type="text/javascript" src="js/ChatTextEntry.js"></script>
<script type="text/javascript" src="js/ChatGridPanel.js"></script>
<script type="text/javascript" src="js/DataTip.js"></script>
<script type="text/javascript" src="js/roster.js"></script>
<script type="text/javascript" src="js/DDTabPanel.js"></script>
<script type="text/javascript" src="js/ChatTabPanel.js"></script>
<script type="text/javascript" src="js/ChatUI.js"></script>
<script type="text/javascript" src="js/Dialogs.js"></script>
<script type="text/javascript" src="js/ChatView.js"></script>
<script type="text/javascript" src="js/XMPPConn.js"></script>
<script type="text/javascript" src="js/Events.js"></script>
<script type="text/javascript" src="js/AllChatMessageWindow.js"></script>
<script type="text/javascript" src="js/UIBuilder.js"></script>
<script type="text/javascript">
Strophe.log = function(level, msg){
	Application.log( msg );
};
</script>
<?php } else { ?>
<script type="text/javascript" src="100/<?php echo gmdate('YmdHi'); ?>.js"></script>
<?php } ?>

<script type="text/javascript">
 Application.ROUTE = "<?php echo $config["punjab_route"]; ?>";
 Application.BOSH = "<?php echo $config["bosh_service"]; ?>";
 Application.RECONNECT = true;
 Application.AUTOJOIN = true;
 Application.ATTEMPTS = 0;
 Application.XMPPHOST = "<?php echo $config["xmpp_domain"]; ?>";
 Application.XMPPMUCHOST = "conference.<?php echo $config["xmpp_domain"]; ?>";
 Application.XMPPRESOURCE = "<?php echo $xmppresource; ?>";
 
 soundManager.url = "swf/";
 soundManager.consoleOnly = true;
 soundManager.debugMode = false;
 /* Try HTML5 Audio first? */
 soundManager.preferFlash = false;
 soundManager.onload = function() {
 	Application.log("SoundManager2 Loaded...");	
 };
 
 Ext.onReady(function(){

	Ext.EventManager.on(window, 'beforeunload', function() {
		if (typeof Application.XMPPConn != 'undefined'){
			Application.XMPPConn.flush();
			Application.XMPPConn.disconnect();
		}
	});	 
 	Ext.QuickTips.init();
 	var vp = new Application.LiveViewport({
 		renderTo : Ext.getBody(),
 		enableMap : <?php echo (isset($_REQUEST["nomap"]) ? 'false' : 'true'); ?>
 	});
 	vp.show();
 	Application.buildView();
	Ext.TaskMgr.start(Application.ServiceGuard);
 });
</script>
<style type="text/css">
	.x-selectable, .x-selectable * {
		-moz-user-select: text!important;
		-khtml-user-select: text!important;
	}
	.message-entry-box{
		
	}
.x-grid3-dirty-cell {
     background-image:none;
}
p.mymessage{
	text-indent: -20px;
	margin-left: 20px;
}
td.x-grid3-td-message {
    overflow: hidden;
}
td.x-grid3-td-message div.x-grid3-cell-inner {
    white-space: normal;
}
.bigger-font {
	font-size: 30px !important;
}
.buddy-online {
	background-image: url(icons/available.png) !important;
}
.buddy-offline {
	background-image: url(icons/person.png) !important;
}
.buddy-away {
	background-image: url(icons/away.png) !important;
}
.chatroom-icon {
	background-image: url(icons/chat.png) !important;
}
.new-tab{
  background-image:url(icons/new_tab.gif)  !important;
}
.typing-tab{
  background-image:url(icons/typing.png)  !important;
  color : #FF0000 !important;
}
.paused-tab{
  color : #A99C0D !important;
}
.tabno{
}
.author-me {
	font-weight: bold;
}
.author-chatpartner {
	font-weight: bold;
}
.author-nws {
	font-weight: bold;
}
.author-default {
	font-weight: bold;
}
.author-nwsbot {
}
</style>
</head>
<body>
<?php if (isset($_REQUEST["jitter"])){
	echo "<div class=\"x-hide\"></div>";
} ?>
<form id="myloginform" method="post" action="pass.php" class="x-hidden">
<input type="text" id="username" name="username" class="x-hidden" />
<input type="password" id="password" name="password" class="x-hidden" />
<input type="submit" id="submit" value="Login" class="x-hidden" />
</form>
<div id="legends" class="x-hide-display">
<p><b>NEXRAD Base Reflectivity</b>
<br /><img src="icons/n0q-ramp.png" />
<p><b>NMQ Hybrid Scan Reflectivity</b>
<br /><img src="icons/hsr.png" />
<p><b>NMQ Q2 1 Hour Precipitation</b>
<br /><img src="icons/q2-1h.png" />
<p><b>NMQ Q2 1-3 Day Precipitation</b>
<br /><img src="icons/q2-24h.png" />
</div>

<div id="loginmessage" class="x-hide-display">
Welcome to NWSChat Live, please log in with your NWSChat account.
<br /><a href="/pwupdate.php">Forgot your password?</a>
<?php if(isset($_REQUEST["nomap"])){ 
  echo "<br />Switch to <a href='?'>NWSChat Live with Map</a>";	
} else {
  echo "<br />Switch to <a href='?nomap'>NWSChat Live without Map</a>";		
} ?>
</div>

<div id="help" class="x-hide-display">
<h3>NWSChat Live Application</h3>

<p><h4>Most Recent Changes</h4>
<ul>
 <li>14 Feb 2013: Plain text messages that contain URLs are now clickable.</li>
 <li>5 Dec 2012: Added Tribal Boundaries as an overlay option.</li>
 <li>1 May 2012: Added NWS Fire Weather Zones as an overlay option.</li>
 <li>12 Mar 2012: The "All Chats" tab introduced an instability by giving the web
 browser too much work to do.  This would cause the browser to report a script
 is busy error or other poor things would happen.  The "All Chats" tab has been
 adjusted to only load <strong>new</strong> messages after you join the room.</li>
 <li>30 Jan 2012: Updated colors used to differentiate chatroom authors to hopefully
 be a bit more distinguishable.</li>
</ul>

<p style="margin-top: 5px;">"NWSChat Live" is a pure web browser instant messaging client 
for NWSChat.  The purpose of the application is to provide users 
with a painless means to join the NWSChat conversation without
installing third party software or worrying about local network
firewalls.  Since this application runs purely over HTTPS 
(port 443) and without third party browser plugins, almost all users 
should be able to run this application without local modifications.
The only requirement is for a modern web browser that supports
javascript.</p>

<p style="margin-top: 5px;">This application is under rapid development 
and may contain bugs.  Please report bugs and suggestions to 
<a target="_new" href="mailto:<?php echo $config["nwschatadmin"]; ?>"><?php echo $config["nwschatadmin"]; ?></a>.
Please be sure to mention the version and brand of web browser
you use.</p>

<p><strong>Audio Alert Credits</strong>
<ul>
 <li><a target="_new" href="http://soundbible.com/1252-Bleep.html">Bleep Noise</a>, Attribution 3.0, Recorded by Mike Koenig</li>
 <li><a target="_new" href="http://soundbible.com/1572-Single-Cow.html">Cow</a>, Attribution 3.0, Recorded by BuffBill84</li>
 <li><a target="_new" href="http://soundbible.com/1462-Two-Tone-Doorbell.html">Door Bell</a>, Sampling Plus 1.0, Recorded by akanimbus</li>
 <li><a target="_new" href="http://soundbible.com/1063-Radio-Interruption.html">EAS Tone</a>, Attribution 3.0, Recorded by Mike Koenig</li>
 <li><a target="_new" href="http://soundbible.com/1441-Elevator-Ding.html">Elevator</a>, Sampling Plus 1.0, Recorded by Corsica</li>
</ul>

</div>
</body>
</html>
