<?php
require_once("../../include/props.php");

$xmppresource = sprintf("NWSChatLive_%s_%s", $_SERVER["REMOTE_ADDR"],
		gmdate("His"));
?>
<html lang='en'>
<head>
 <meta charset="UTF-8"><!-- Ensure our XMPP stuff is UTF-8 as well -->
 <title>NWSChat Live</title>
 <link rel="stylesheet" type="text/css" href="/ext-3.4.1/resources/css/ext-all.css"/>
 <link rel="stylesheet" type="text/css" href="live.css"/>
</head>
<body>
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
 <li>25 Feb 2014: Improve stability</li>
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

<!-- Jquery stuff -->
<script language='javascript' type='text/javascript' src='/js/jquery.1.9.1.min.js'></script>
<!-- ExtJS Stuff -->

<script type="text/javascript" src="/ext-3.4.1/adapter/jquery/ext-jquery-adapter.js"></script>
<script type="text/javascript" src="/ext-3.4.1/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="/ext-3.4.1/ext-all.js"></script>
<!--  SoundManager -->
<script type="text/javascript" src="/js/soundmanager2-jsmin.js"></script>
<script type="text/javascript">
 Ext.BLANK_IMAGE_URL = '/ext-3.4.1/resources/images/default/s.gif';
 Ext.ns("Application");
 Application.DEBUGMODE = <?php echo (isset($_GET["devel"])) ? 'true': 'false'; ?>;
</script>

<?php if (!isset($_REQUEST["nomap"])){ ?>
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?sensor=false"></script>
<script type="text/javascript" src="/js/OpenLayers_GeoExt.js"></script>
<script type="text/javascript" src="101/<?php echo gmdate('YmdHi'); ?>.js"></script>
<?php } ?>
 <!-- Finally, the app -->
<?php if (isset($_GET["devel"])){ ?>
<script type='text/javascript' src='js/strophe.js'></script>
<script type='text/javascript' src='js/disco.js'></script>
<script type="text/javascript" src="js/overrides.js"></script>
<script type="text/javascript" src="js/CheckColumn.js"></script>
<script type="text/javascript" src="js/LoginWindow.js"></script>
<script type="text/javascript" src="js/DebugWindow.js"></script>
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
 	(new Application.LiveViewport({
 		renderTo : Ext.getBody(),
 		enableMap : <?php echo (isset($_REQUEST["nomap"]) ? 'false' : 'true'); ?>
 	})).show();
	Ext.TaskMgr.start(Application.ServiceGuard);
 });
</script>

</body>
</html>
