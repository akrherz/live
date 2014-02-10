#!/bin/sh

DEVDIR="public_html/live"

# --warning_level VERBOSE
java -jar ~/lib/compiler.jar \
--js=${DEVDIR}/js/overrides.js \
--js=${DEVDIR}/strophe/strophe.js \
--js=${DEVDIR}/strophe/disco.js \
--js=${DEVDIR}/js/MUCChatPanel.js \
--js=${DEVDIR}/js/MUCRoomUsers.js \
--js=${DEVDIR}/js/UserColors.js \
--js=${DEVDIR}/js/ChatGridPanel.js \
--js=${DEVDIR}/js/ChatTextEntry.js \
--js=${DEVDIR}/js/ChatPanel.js \
--js=${DEVDIR}/js/LiveViewport.js \
--js=${DEVDIR}/js/MapLegend.js \
--js=${DEVDIR}/js/CheckColumn.js \
--js=${DEVDIR}/js/DataTip.js \
--js=${DEVDIR}/js/roster.js \
--js=${DEVDIR}/js/AllChatMessageWindow.js \
--js=${DEVDIR}/js/DDTabPanel.js \
--js=${DEVDIR}/js/ChatTabPanel.js \
--js=${DEVDIR}/js/ChatUI.js \
--js=${DEVDIR}/js/Dialogs.js \
--js=${DEVDIR}/js/ChatView.js \
--js=${DEVDIR}/js/XMPPConn.js \
--js=${DEVDIR}/js/Events.js \
--js=${DEVDIR}/js/UIBuilder.js \
--js_output_file=${DEVDIR}/live.js
