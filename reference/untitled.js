
<!--Vendor: Yahoo, Format: Login Ad - Video, Name: Login Ad-->
<link rel="stylesheet" href="https://s.yimg.com/cv/eng/externals/actjs/1.0.11/min/assets/ACT_icons/ACT_icons.css" type="text/css" />
<style>
    html,body {background-color: #FFFFFF;}
    #ad_container {background-position: center top;background-repeat: no-repeat;margin: 0 auto;}
    .ad_noimg {display:none;}
</style>
<div id="login-ad-container" style="margin:0px;position:relative;background:no-repeat center top;">

    <!-- Ad Div -->
    <div id="login-ad" style="margin:0px 0px">
        <noscript>
            <a href="${CLICKURL?videologin_backup_img}https://ad.doubleclick.net/ddm/clk/294455204;121291394;c">
                <img src="https://s.yimg.com/cv/ae/us/audience/101023/1440x1024x8kmde7nc.jpg" border="0">
            </a>
                                            </noscript>
    </div>

    <!-- ACT.js Base -->
    <script language="javascript">
        (function(){
            if(!window.ACT){
                window.ACT = { "adQueue": [] };
            }
            ACT.adQueue.push(
                function(){
                    var event = ACT.Event, dom = ACT.Dom, byId = dom.byId, util = ACT.Util, ua = ACT.UA, lang = ACT.Lang, path = "https://s.yimg.com/cv/ae/us/audience/101023/", videopath = "https://v4s.yimg.com/cv/ae/us/audience/101023/",
                    size = {
                                                                        t: 213, l: 196,
                                                                        w: 280, h: 158
                    },
                                        ad_url = "https://ad.doubleclick.net/ddm/clk/294455204;121291394;c";
                    var ad = ACT.Base({
                        conf: {
                            adId: 'login_id',
                            template: { format: "login",  type: "video_login",  width: 1440,  height: 1024 },
                            cookie: { name: "${LIBRARYADID}" },
                            tracking: {
                                rB: '${CLICKURL?ClientSideEditable}',
                                r0: '${CLICKURL}',
                                z1: '${INTERACTION_URL}',
                                cb: '${REQUESTID}'
                            },
                            customData: {
                                "layers.videoLogin.html_container.css.background": "url('"+path+"1440x1024x8kmdeicg.jpg') no-repeat",
                                "layers.videoLogin.bkp_container.css.background": "url('"+path+"1440x1024x8kmde7nc.jpg') no-repeat",
                                                                "layers.videoLogin.click_container.events.actHTMLClick.URLpath": "https://ad.doubleclick.net/ddm/clk/294455204;121291394;c",
                                "layers.videoLogin.bkp_container.events.actBKPClick.URLpath": "https://ad.doubleclick.net/ddm/clk/294455204;121291394;c",
                                                                                                "layers.videoLogin.sp_container.css.display": "",
                                "layers.videoLogin.sp_container.css.width": size.w+"px",
                                "layers.videoLogin.sp_container.css.height": size.h+"px",
                                                                                                "layers.videoLogin.fstart_container.css.display": "",
                                "layers.videoLogin.fstart_container.css.background": "url('"+path+"600x600x8kmamo8x.png')",
                                                                                                                                "layers.videoLogin.fend_container.css.background": "url('"+path+"600x600x8kmam7a8.png')",
                                                                                                "layers.videoLogin.video_container.css.marginTop": size.t+"px",
                                "layers.videoLogin.video_container.css.marginLeft": size.l+"px",
                                "layers.videoEmbed.video_container.css.marginTop": size.t+"px",
                                "layers.videoEmbed.video_container.css.marginLeft": size.l+"px",
                                                                "layers.videoLogin.apstart_button.css.display": "",
                                                                "layers.videoLogin.apbt_container.css.display": "",
                                "layers.videoLogin.apbt_container.css.width": size.w+"px",
                                "layers.videoLogin.apbt_container.css.height": size.h+"px",
                                "layers.videoLogin.video_login_ap.css.width": size.w+"px",
                                "layers.videoLogin.video_login_ap.css.height": size.h+"px",
                                "layers.videoLogin.video_login_ap.videoHtmlConfig.videoMuted": true,
                                "layers.videoLogin.video_login_ap.videoHtmlConfig.controls": false,
                                                                "layers.videoLogin.video_login_ap.videoHtmlConfig.autoplay": false,
                                                                "layers.videoEmbed.video_login_full.videoHtmlConfig.autoplay": false,
                                "layers.videoEmbed.video_login_full.videoHtmlConfig.videoMuted": false,
                                "layers.videoEmbed.video_login_full.videoHtmlConfig.controls": true,
                                "layers.videoEmbed.video_login_full.css.width": size.w+"px",
                                "layers.videoEmbed.video_login_full.css.height": size.h+"px",
                                "layers.videoEmbed.video_login_full.videoHtmlConfig.videoMP4": videopath+"600x600x8kmdeb4i.mp4",
                                "layers.videoEmbed.video_login_full.videoHtmlConfig.videoWebM": videopath+"600x600x8kmam8j.webm",
                                "layers.videoEmbed.swf_container.css.width": size.w+"px",
                                "layers.videoEmbed.swf_container.css.height": size.h+"px",
                                "layers.videoEmbed.swf_container.swfConfig.flashvars" : {
                                    "rB": '${CLICKURL?ClientSideEditable}',
                                    "r0": '${CLICKURL}',
                                    "z1": '${INTERACTION_URL}',
                                    "console": 0,
                                    "swfext" : "",
                                    "videoURL": videopath+"600x600x8kmdeb4i.mp4",
                                    "hasSound": 1,
                                    "controls": 1,
                                    "trackingID": 1,
                                    "trackingVar": "clickTAG",
                                    "cap": "1",
                                    "type": "login",
                                    "clickTAG": "https://ad.doubleclick.net/ddm/clk/294455204;121291394;c"
                                }
                            },
                            pixels: []
                        },
                        superConf: "config-object-video-login",
                        extend: {
                            init: function () {
                                var root = this;
                                event.on("layer:played", this.loaded, null, this);
                                event.on("video:state", this.videoEvent, null, this);
                                ACT.SWFBridge.swfAction = function(){ root.swfAction(arguments[1][0], arguments[1][1]); };
                            },
                            videoEvent: function (e) {
                                var id = "video_login_full", label = "", vID = byId("vfull_container"), eID = byId("fend_container"), vNode = byId("video_login_full");
                                if (e.videoId === id && e.data && e.data !== "") {
                                    if (e.data === "clicked") {
                                        if(vNode && !vNode.paused){ vNode.pause(); }
                                        ad.adRedirect(ad_url, "login_click_video_clicktagrich");
                                    } else {
                                        if (e.data === "complete") {
                                            if (vID) { vID.style.display = "none"; }
                                            if (eID) { eID.style.display = ""; }
                                        }
                                        ad.videoTrack(e.data);
                                    }
                                }
                            },
                            videoTrack: function (progress) {
                                var label = (util.inString(progress, "percent") || progress === "complete") ? "login_view_videouser_" + progress : "login_click_videouser_" + progress;
                                event.fire("add:actions", { type: "track", label: label });
                            },
                            adRedirect: function (url, label) {
                                var int = util.hashString(label);
                                var redir = this.redirect_track(label, int, url);
                                if (redir != "") { window.open(redir, '_blank'); }
                            },
                                                        loaded: function(data){
                                                                                            },
                            swfAction: function(a, b){
                                if(a === "login_view_video1_complete"){ event.fire("add:actions", { type: "stopLayer", to: "videoEmbed", destroy: true }); }
                                else if ( a==="clickTAG" ) { return; }
                                event.fire("add:actions", { type: "track", label: a });
                            }
                        }
                    });
                }
            );
        })();
    </script>
    <!-- ACT.js Framework -->
    <script type="text/javascript" charset="utf-8" src="https://s.yimg.com/zz/combo?/cv/eng/externals/actjs/1.0.11/min/ACT.core.js&/cv/ae/global/actjs/login/1444153730/config-obj.js"></script>
</div>