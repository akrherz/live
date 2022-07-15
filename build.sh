#!/bin/sh

DEVDIR="public_html/live"
cd $DEVDIR

# --warning_level VERBOSE
java -jar ~/lib/compiler.jar \
--js=js/overrides.js \
--js=js/strophe.js \
--js=js/disco.js \
--js=js/LoginPanel.js \
--js=js/TabLoginPanel.js \
--js=js/DebugWindow.js \
--js=js/MUCChatPanel.js \
--js=js/MUCRoomUsers.js \
--js=js/UserColors.js \
--js=js/ChatGridPanel.js \
--js=js/ChatTextEntry.js \
--js=js/ChatPanel.js \
--js=js/LiveViewport.js \
--js=js/MapLegend.js \
--js=js/CheckColumn.js \
--js=js/DataTip.js \
--js=js/roster.js \
--js=js/AllChatMessageWindow.js \
--js=js/DDTabPanel.js \
--js=js/ChatTabPanel.js \
--js=js/ChatUI.js \
--js=js/Dialogs.js \
--js=js/ChatView.js \
--js=js/XMPPConn.js \
--js=js/Events.js \
--js=js/UIBuilder.js \
--js_output_file=live.js
