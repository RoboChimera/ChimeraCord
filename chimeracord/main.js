const { app, BrowserWindow, Tray, nativeImage, Menu, shell, globalShortcut, remote} = require('electron');
const contextMenu = require('electron-context-menu');
const Store = require('electron-store');

contextMenu({ showCopyImageAddress: true, showSaveImageAs: true,
       	showInspectElement: false,
 	showCopyImage: false
})

const storage = {
	isDarkMode: {
		type: 'boolean',
		default: 'false'
	}
}

const store = new Store(storage);
const path = require('path');
const userAgent = "Mozilla/5.0 (X11; Linux x86_64; FreeBSD amd64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36";
const singleInstanceLock = app.requestSingleInstanceLock();

let appQuiting = false;
let tray;
let trayMenu;
let icon
let win;

app.enableSandbox();

function darkMode() {
	if (store.get('isDarkMode') == false) {
		icon = nativeImage.createFromPath('src/tray-icon2.png');
		win.webContents.executeJavaScript(
		`
			var styles =
			\`
				.theme-dark, .theme-light {
					--header-primary: #2a2a2a;
					--header-secondary: #3c3c3c;
					--text-normal: #2a2a2a;
					--text-muted: #3c3c3c;
					--text-mention: #382848;
					--text-link: #09739c;
					--text-link-low-saturation: hs((197,calc(var(--saturation-factor, 1)*100%),52.9);
					--text-positive: hsl(139,calc(var(--saturation-factor, 1)*66,8%),58.6);
					--text-warning: hsl(38,calc(var--saturation-factor, 1)*95.7%),54.1%);
					--text-danger:hsl(359,calc(var(--saturation-factor, 1)*82.6%),59.4%);
					--text-brand: hsl(235,calc(var(--saturation-factor, 1)*86.1%),77.5%);
					--interactive-normal: #282828;
					--interactive-hover: #3c3c3c;
					--interactive-active: #282828;
					--interactive-muted: #505050;
					--background-primary: #fbfbfb;
					--background-secondary: #ebebeb;
					--background-secondary-alt: #ebebeb;
					--background-tertiary: #dbdbdb;
					--background-accent: #a8a8a8;
					--background-floating: #dbdbdb;
					--background-mobile-primary: #282828;
					--background-mobile-secondary: #3c3c3c;
					--background-modifier-hover: rgba(79,84,92,0,1);
					--background-modifier-active: rgba(79,84,92,0,1);
					--background-modifier-selected: rgb(220,221,229);
					--background-modifier-selected: hsla(0,0%,100%,0.06);
					--info-positive-text: #282828;
					--info-warning-text: #282828;
					--info-warning-text: #282828;
					--info-danger-text: #282828:
					--info-help-background: hsla(197,calc(var(--saturation-factor, 1)*100%),47.8%,0.1);
					--info-help-foreground: hsl(197,calc(var(--saturation-factor, 1)*100%),47.8%);
					--info-help-text: #282828;
					--status-warning-text: #fff;
					--scrollbar-thin-thumb: #55595e;
					--scrollbar-thin-track: #0000;
					--scrollbar-auto-thumb: #55595e;
					--scrollbar-auto-track: #0000;
					--scrollbar-auto-scrollbar-color-thumb: #55595e;
					--scrollbar-auto-scrollbar-color-track: #0000;
					--elevation-stroke: 0 0 0 1px rgba(4,4,5,0.15);
					--elevation-low: 0 1px 0 rgba(4,4,5,0.2),0 1.5px 0 rgba(6,6,7,0.05),0 2px 0 rgba(4,4,5,0.05);
					--elevation-medium: 0 4px 4px rgba(0,0,0,0.16);
					--elevation-high: 0 8px 16px rgba(0,0,0,0.24);
					--logo-primary: #282828;
					--control-brand-foreground: hsl(235,calc(var(--saturation-factor, 1)*86.1%),77.5%);
					--control-brand-foreground-new: hsl(235,calc(var(--saturation-factor, 1)*86.1%),77.5%);
					--background-mentioned: hsla(38,calc(var(--saturation-factor, 1)*95.7%),54.1%,0.1);
					--background-mentioned-hover: hsla(38,calc(var(--saturation-factor, 1)*95.7%),54.1%,0.08);
					--background-message-hover: rgba(4,4,5,0.07);
					--channels-default: #505050;
					--guild-header-text-shadow: 0 1px 1px rgba(0,0,0,0.4);
					--channeltextarea-background: #fbfbfb;
					--activity-card-background: #dbdbdb;
					--textbox-markdown-syntax: #3c3c3c;
					--deprecated-card-bg: rgba(32,34,37,0.6);
					--deprecated-card-editable-bg: rgba(32,34,37,0.3);
					--deprecated-store-bg: #dbdbdb;
					--deprecated-quickswitcher-input-background: #dbdbdb;
					--deprecated-quickswitcher-input-placeholder: hsla(0,0%,100%,0.3);
					--deprecated-text-input-bg: rgba(0,0,0,0.1);
					--deprecated-text-input-border: rgba(0,0,0,0.3);
					--deprecated-text-input-border-hover: #fff;
					--deprecated-text-input-border-disabled: #fbfbfb;
					--deprecated-text-input-prefix: #dcddde;
					--background-modal: #fbfbfb;
					--background-footer: #ebebeb;
				}
			\`

			var styleSheet = document.createElement("style")
			styleSheet.innerText = styles
			document.head.appendChild(styleSheet)
		`
		)
	} else {
		icon = nativeImage.createFromPath('src/tray-icon.png');
		win.webContents.executeJavaScript(
		`
			var styles =
			\`
				.theme-dark, .theme-light {
					--header-primary: #fff;
					--header-secondary: #b9bbbe;
					--text-normal: #dcddde;
					--text-muted: #939599;
					--text-mention: #fbfbfb;
					--text-link: hsl(197,calc(var(--saturation-factor, 1)*100%)47.8);
					--text-link-low-saturation: hs((197,calc(var(--saturation-factor, 1)*100%),52.9);
					--text-positive: hsl(139,calc(var(--saturation-factor, 1)*66,8%),58.6);
					--text-warning: hsl(38,calc(var--saturation-factor, 1)*95.7%),54.1%);
					--text-danger:hsl(359,calc(var(--saturation-factor, 1)*82.6%),59.4%);
					--text-brand: hsl(235,calc(var(--saturation-factor, 1)*86.1%),77.5%);
					--interactive-normal: #b9bbbe;
					--interactive-hover: #d9dbdc;
					--interactive-active: #fff;
					--interactive-muted: #454a52;
					--background-primary: #18191c;
					--background-secondary: #1a1a1d;
					--background-secondary-alt: #1a1a1d;
					--background-tertiary: #151516;
					--background-accent: #25272c;
					--background-floating: #0d0e10;
					--background-mobile-primary: #2c30d4;
					--background-mobile-secondary: #1a1a1d;
					--background-modifier-hover: rgba(79,84,92,0,16);
					--background-modifier-active: rgba(79,84,92,0,24);
					--background-modifier-selected: rgb(42,43,44);
					--background-modifier-selected: hsla(0,0%,100%,0.06);
					--info-positive-text: #fff;
					--info-warning-text: #fff;
					--info-warning-text: #fff;
					--info-danger-text: #fff:
					--info-help-background: hsla(197,calc(var(--saturation-factor, 1)*100%),47.8%,0.1);
					--info-help-foreground: hsl(197,calc(var(--saturation-factor, 1)*100%),47.8%);
					--info-help-text: #fff;
					--status-warning-text: #000;
					--scrollbar-thin-thumb: #5c5f5f;
					--scrollbar-thin-track: #0000;
					--scrollbar-auto-thumb: #5c5f5f;
					--scrollbar-auto-track: #0000;
					--scrollbar-auto-scrollbar-color-thumb: #5c5f5f;
					--scrollbar-auto-scrollbar-color-track: #0000;
					--elevation-stroke: 0 0 0 1px rgba(4,4,5,0.15);
					--elevation-low: 0 1px 0 rgba(4,4,5,0.2),0 1.5px 0 rgba(6,6,7,0.05),0 2px 0 rgba(4,4,5,0.05);
					--elevation-medium: 0 4px 4px rgba(0,0,0,0.16);
					--elevation-high: 0 8px 16px rgba(0,0,0,0.24);
					--logo-primary: #fff;
					--control-brand-foreground: hsl(235,calc(var(--saturation-factor, 1)*86.1%),77.5%);
					--control-brand-foreground-new: hsl(235,calc(var(--saturation-factor, 1)*86.1%),77.5%);
					--background-mentioned: hsla(38,calc(var(--saturation-factor, 1)*95.7%),54.1%,0.1);
					--background-mentioned-hover: hsla(38,calc(var(--saturation-factor, 1)*95.7%),54.1%,0.08);
					--background-message-hover: rgba(4,4,5,0.07);
					--channels-default: #959596;
					--guild-header-text-shadow: 0 1px 1px rgba(0,0,0,0.4);
					--channeltextarea-background: #1e2023;
					--activity-card-background: #202225;
					--textbox-markdown-syntax: #5f6266;
					--deprecated-card-bg: rgba(32,34,37,0.6);
					--deprecated-card-editable-bg: rgba(32,34,37,0.3);
					--deprecated-store-bg: #36393f;
					--deprecated-quickswitcher-input-background: #72767d;
					--deprecated-quickswitcher-input-placeholder: hsla(0,0%,100%,0.3);
					--deprecated-text-input-bg: rgba(0,0,0,0.1);
					--deprecated-text-input-border: rgba(0,0,0,0.3);
					--deprecated-text-input-border-hover: #040405;
					--deprecated-text-input-border-disabled: #1c1d1f;
					--deprecated-text-input-prefix: #dcddde;
					--background-modal: #171718;
					--background-footer: #131314;
				}
			\`

			var styleSheet = document.createElement("style")
			styleSheet.innerText = styles
			document.head.appendChild(styleSheet)
		`
		)
	}
}

function initWindow() {
	appQuiting = false;
	win.webContents.setUserAgent(userAgent);
	win.webContents.executeJavaScript(
	`
		var styles =
		\`
			.theme-dark, .theme-light .container-ZMc96U {
				background-color: var(--background-primary);
			}

			.children-3xh0VB h3 {
				color: var(--header-secondary);
			}

			.children-3xh0VB:after, video.ready-3BZNWT, .scroller-3X7KbA.none-2-_0dP.scrollerBase-_bVAAt:nth-last-child(2) > .listItem-3SmSlK:nth-child(6), .scroller-3X7KbA.none-2-_0dP.scrollerBase-_bVAAt:nth-last-child(2) > .listItem-3SmSlK:nth-child(7), #appearance-tab div.marginTop8-24uXGp:nth-child(2) {
				display: none;
			}
			
			span.mention.wrapper-1ZcZW-.interactive {
				color: var(--text-mention);
			}

			div.formNotice-2nS8ey,.connectedAccounts-Jb3L2,.codeRedemptionRedirect-2hYMSQ.card-16VQ8C,.select-1Ia3hD.lookFilled-1GseHa,form.authBoxExpanded-AN2aH1.authBox-1HR6Ha,section.authBox-1HR6Ha.theme-dark.chooseAccountAuthBox-Udr8ty {
				background-color: var(--background-secondary);
				border-color: var(--background-accent);
			}

			div.codeRedemptionRedirect-2hYMSQ.card-16VQ8C {
				color: var(--text-muted);
			}

			.input-2g-os5.multiInput-1VARjC,.inputDefault-3FGxgL {
				background: var(--background-floating);
			}

			button.fieldButton-14lHvK.removeButton-v6eolJ.button-f2h6uQ.lookLink-15mFoz.lowSaturationUnderline-Z6CW6z.colorPrimary-2AuQVo.sizeSmall-wU2dO-.grow-2sR_-F {
				background-color: #cc1531;
			}

			div.markup-eYLPri.editor-H2NA06.slateTextArea-27tjG0.fontSize16Padding-XoMpjI.textAreaWithoutAttachmentButton-1as0NS {
				background-color: var(--background-secondary);
			}

			div.tipTitle-3FYEQp {
				color: var(--header-primary);
				font-size: 30px;
				margin-bottom: 1.2%;
			}

			div.tip-1AwED_ {
				color: var(--header-secondary);
				font-size: 15px;
				margin-top: 7%;
			}

			div.flex-2S1XBF.flex-3BkGQD.horizontalReverse-60Katr.horizontalReverse-2QssvL.flex-3BkGQD.directionRowReverse-HZatnx.justifyStart-2Mwniq.alignStretch-Uwowzr.noWrap-hBpHBz.footer-31IekZ.footerSeparator-VzAYwb div.contents-3calmk {
				background-color: var(--background-floating);
			}

			span.needAccount-MrvMN7 {
				color: var(--text-normal);
			}

			div.codeRedemptionRedirect-2hYMSQ.card-16VQ8C {
				color: var(--text-muted);
			}

			.input-2g-os5.multiInput-1VARjC.inputDefault-3FGxgL {
				background: var(--background-floating);
			}

			button.marginBottom20-315RVT.marginTop4-2JFJJI.linkButton-2ax8wP.button-f2h6uQ.lookLink-15mFoz.lowSaturationUnderline-Z6CW6z.colorLink-1Md3RZ.sizeMin-DfpWCE.grow-2sR_-F div.contents-3ca1mk, button.smallRegisterLink-1qEJhz.linkButton-2ax8wP.button-f2h6uQ.lookLink-15mFoz.lowSaturationUnderline-Z6CW6z.colorLink-1Md3RZ.sizeMin-DfpWCE.grow-2sR_-F div.contents-3ca1mk {
				color: var(--text-link);
			}

			div.content-2hZxGK.content-2fxLUd.thin-31rlnD.scrollerBase-_bVAAt, div.flex-2S1XBF.flex-3BkGQD.horizontal-112GEH.horizontal-1Piu5-.flex-3BkGQD.directionRow-2Iu2A9.justifyStart-2Mwniq.alignCenter-14kD11.noWrap-hBpHBz.header-1zd7se, div.content-2hZxGK.content-26qlhD.thin-31rlnD.scrollerBase-_bVAAt {
				background-color: var(--background-primary);
			}

			div.flex-2S1XBF.flex-3BkGQD.horizontalReverse-60Katr.horizontalReverse-2QssvL.flex-3BkGQD.directionRowReverse-HZatnx.justifyStart-2Mwniq.alignStretch-Uwowzr.noWrap-hBpHBz.footer-31IekZ.footerSeparator-VzAYwb, div.contents-3calmk {
				background-color: var(--background-floating);
			}

			section.theme-dark.container-ZMc96U.themed-Hp1KC_ {
				background-color: var(--background-primary);
			}

			div.item-3mHhwr.item-3XjbnG.selected-g-kMVV.themed-2-lozF {
				background-color: #0000;
				color: var(--text-normal);
				font-weight: 1000;
			}

			div.item-3mHhwr.item-3XjbnG.themed-2-lozF:hover {
				background-color: #0000;
				color: var(--text-normal);
			}

			button.button-f2h6uQ.lookLink-15mFoz.lowSaturationUnderline-Z6CW6z.colorPrimary-2AuQVo.sizeMedium-2bFIHr.grow-2sR_-F {
				color: var(--text-muted);
				font-weight: 1000;
			}

			.theme-dark, .theme-light .contentWarningPopout-WKdbDG {
				background-color: var(--activity-card-background);
				-webkit-box-shadow: 0 2px 10px 0 rgba(28,36,43,.6);
				box-shadow: 0 2px 10px 0 rgba(28,36,43,.6);
			}

			input.input-3r5zZY {
				background-color: var(--background-accent);
			}
			.search-25t1e9 .searchBox-31Zv9h .searchBoxInput-3h4etz {
				font-size: 16px;
				padding: 8px;
				color: var(--text-normal);
			}

			.autocompleteScroller-3L6kmy {
				background-color: var(--background-secondary-alt)
			}

			.theme-dark, .theme-light .message-G6O-Wv {
				background-color: var(--background-secondary);
				-webkit-box-shadow: 0 0 0 1px rgba(32,34,37,.6),0 2px 10px 0 rgba(0,0,0,.2);
				box-shadow: 0 0 0 1px rgba(32,34,37,.6),0 2px 10px 0 rgba(0,0,0,.2);
			}

			.theme-dark, .theme-light .autocompleteArrow-jJE9TQ, .theme-dark, .theme-light .header-3i_Csh {
				background-color: var(--background-modal);
			}

			.theme-dark, .theme-light .tierBody-1d3UiS {
				background-color: var(--background-secondary);
				color: #b9bbbe;
			}

			.theme-dark, .theme-light .searchBox-pyIJJj {
				background-color: var(--background-secondary);
				-webkit-box-shadow: 0 2px 5px 0 rgba(0,0,0,.2);
				box-shadow: 0 2px 5px 0 rgba(0,0,0,.2);
				color: var(--text-normal);
			}

			.backButton-2Ps-B8 {
				height: 38px;
				margin-right: auto;
				color: var(--text-normal);
			}

			.theme-dark, .theme-light .pageWrapper-2PwDoS {
				background-color: var(--background-primary);
				color: #fff;
			}

			.avatarUploaderInnerSquareDisabled-e_U2MZ {
				background-color: var(--background-accent);
				background-image: none;
			}

			.peopleColumn-1wMU14 {
				display: -webkit-box;
				display: -ms-flexbox;
				display: flex;
				-webkit-box-orient: vertical;
				-webkit-box-direction: normal;
				-ms-flex-direction: column;
				flex-direction: column;
				-webkit-box-flex: 1;
				-ms-flex: 1 1 auto;
				flex: 1 1 auto;
				overflow: hidden;
				background-color: var(--background-primary);
			}

			.theme-dark, .theme-light .lookFilled-yCfaCM.colorGrey-2iAG-B {
				color: #fff;
				background-color: var(--background-accent);
			}

			.scroller-18M1mG {
				padding-bottom: 8px;
				background-color: var(--background-secondary);
			}

			input.input-2VB9rf {
				background-color: var(--background-primary);
			}

			.theme-dark, .theme-light .colorPickerCustom-1swUKF {
				background: var(--background-secondary-alt);
				border-color: #202225;
			}

			.theme-dark, .theme-light .quickSelectPopout-2F0PXw {
				background: var(--background-tertiary);
				color: #f6f6f7;
			}

			.theme-dark, .theme-light .codeRedemptionRedirect-3SBiCp {
				color: #fff;
				background-color: var(--activity-card-background);
				border-color: #202225;
			}

			.connectionHeader-2rV1ze {
				position: relative;
				display: grid;
				grid-template-columns: auto 1fr auto;
				padding: 20px;
				background: #202024;
				border-radius: 8px 8px 0 0;
			}

			.accountList-305sx3 {
				padding: 20px 20px 12px;
				background-color: #212124;
				border-radius: 8px;
			}

			.theme-dark, .theme-light .footer-VCsJQY {
				background-color: var(--background-footer);
				-webkit-box-shadow: inset 0 1px 0 rgba(47,49,54,.6);
				box-shadow: inset 0 1px 0 rgba(47,49,54,.6);
			}

			#uid_17 {
				background-color: var(--background-secondary);
			}

			#uid_17--1 {
				background-color: var(--background-tertiary);
			}

			.datePicker-70cO23 {
				background-color: var(--background-secondary);
			}

			.theme-dark, .theme-light .container-KM8BU6, .theme-dark, .theme-light .reactors-1VXca7 {
				background-color: var(--background-secondary-alt);
			}

			.react-datepicker {
				background-color: var(--background-secondary);
			}

			.theme-dark, .theme-light .selected-3H3-RC {
				background-color: var(--background-accent);
			}

			scroller-2GkvCq thin-31rlnD scrollerBase-_bVAAt fade-1R6FHN {
				background-color: var(--background-footer);
			}

			.scroller-2MALzE.list-2u03C-.thin-31rlnD.scrollerBase-_bVAAt {
				background-color: var(--background-secondary);
			}

			.categoryHeader-OpJ1Ly {
				position: sticky;
				top: 0;
				padding: 0 8px;
				background-color: var(--background-secondary);
			}

			.theme-dark, .theme-light .root-g14mjS {
				background-color: var(--background-modal);
				-webkit-box-shadow: 0 0 0 1px rgba(32,34,37,.6),0 2px 10px 0 rgba(0,0,0,.2);
				box-shadow: 0 0 0 1px rgba(32,34,37,.6),0 2px 10px 0 rgba(0,0,0,.2);
			}

			.theme-dark, .theme-light .footer-31IekZ {
				background-color: var(--background-footer);
				-webkit-box-shadow: inset 0 1px 0 rgba(47,49,54,.6);
				box-shadow: inset 0 1px 0 rgba(47,49,54,.6);
			}

			.search-1iTphC .searchBox-2_mAlO .searchBoxInput-K6mkng {
				font-size: 16px;
				padding: 8px;
				color: var(--text-normal);
			}

			.theme-dark, .theme-light .autocompleteArrow-Zxoy9H, .theme-dark, .theme-light .header-2bNvm4 {
				background-color: var(--background-footer);
			}

			.theme-dark, .theme-light .container-VSDcQc .sectionTag-pXyto9 {
				background-color: var(--background-modal);
				color: #72767d;
			}

			.theme-dark, .theme-light .root-1gCeng {
				background-color: var(--background-modal);
				-webkit-box-shadow: 0 0 0 1px rgba(32,34,37,.6),0 2px 10px 0 rgba(0,0,0,.2);
				box-shadow: 0 0 0 1px rgba(32,34,37,.6),0 2px 10px 0 rgba(0,0,0,.2);
			}

			.theme-dark, .theme-light .pageWrapper-1PgVDX {
				background-color: var(--background-secondary-accent);
				color: #fff;
			}

			.theme-dark, .theme-light .searchBox-3Y2Vi7 {
				background-color: var(--background-secondary);
				-webkit-box-shadow: 0 2px 5px 0 rgba(0,0,0,.2);
				box-shadow: 0 2px 5px 0 rgba(0,0,0,.2);
			}

			.theme-dark, .theme-light .uploadModal-2ifh8j {
				background-color: var(--background-modal);
				-webkit-box-shadow: 0 0 0 1px rgba(32,34,37,.6),0 2px 10px 0 rgba(0,0,0,.2);
				box-shadow: 0 0 0 1px rgba(32,34,37,.6),0 2px 10px 0 rgba(0,0,0,.2);
			}

			.theme-dark, .theme-light .body-3PNusm {
				background-color: var(--background-accent);
				color: #b9bbbe;
			}

			.peopleColumn-29fq28 {
				display: -webkit-box;
				display: -ms-flexbox;
				display: flex;
				-webkit-box-orient: vertical;
				-webkit-box-direction: normal;
				-ms-flex-direction: column;
				flex-direction: column;
				-webkit-box-flex: 1;
				-ms-flex: 1 1 auto;
				flex: 1 1 auto;
				overflow: hidden;
				background-color: var(--background-primary);
			}

			.theme-dark, .theme-light .message-2qRu38 {
				background-color: var(--background-modal);
				-webkit-box-shadow: 0 0 0 1px rgba(32,34,37,.6),0 2px 10px 0 rgba(0,0,0,.2);
				box-shadow: 0 0 0 1px rgba(32,34,37,.6),0 2px 10px 0 rgba(0,0,0,.2);
			}

			peopleColumn-1wMU14 .theme-dark, .theme-light .footer-3mqk7D {
				background-color: var(--background-footer);
				-webkit-box-shadow: inset 0 1px 0 rgba(47,49,54,.6);
				box-shadow: inset 0 1px 0 rgba(47,49,54,.6);
			}

			ul.resultsGroup-1BPR25 {
				background-color: var(--background-secondary)
			}

			.theme-dark, .theme-light .footer-2gL1pp {
				background-color: var(--background-footer);
				-webkit-box-shadow: inset 0 1px 0 rgba(47,49,54,.6);
				box-shadow: inset 0 1px 0 rgba(47,49,54,.6);
			}

			.theme-dark, .theme-light .autocomplete-1vrmpx {
				background-color: #1f2124;
			}

			.theme-dark, .theme-light .selected-1Tbx07 {
				background-color: #303235;
			}

			body {
				line-height: 1;
				margin: 0;
				padding: 0;
				font-family: var(--font-primary);
				overflow: hidden;
				-webkit-user-select: none;
				-moz-user-select: none;
				-ms-user-select: none;
				user-select: none;
				background: var(--background-primary);
			}
		\`

		var styleSheet = document.createElement("style")
		styleSheet.innerText = styles
		document.head.appendChild(styleSheet)
	`
	)
	win.loadURL('https://discord.com/app');
	
	//win.webContents.openDevTools();
	win.on('close', e => {
		if(appQuiting === false) {
			e.preventDefault();
			win.hide();
		} else {
			app.quit();
		}
	})
	
	win.webContents.on("new-window", function(event, url) {
		event.preventDefault();
		if(url != "https://discord.com/*") {
			shell.openExternal(url);
		} else {
			win.load(url);
		}
	})
		
	var trayMenu = Menu.buildFromTemplate([
		{
			label: "Open ChimeraCord", 
			click() { 
				appQuiting = false;
				win.show();
			}
		},
		{
			label: "Quit ChimeraCord",
			click() {
				appQuiting = true;
				app.quit();
			}
		}
	])

	var appMenu = Menu.buildFromTemplate([
		{
			label: 'Application',
			submenu: [
				{
					label: 'Quit',
					click: function() {
						appQuiting = true;
						app.quit();
					},
					accelerator: 'Ctrl+Q'
				}]
		},
		{
			label: 'Settings',
			submenu: [
				{
					label: 'Dark Mode',
					type: 'checkbox',
					click: function() {
						tray.destroy();
						if (store.get('isDarkMode') == true) {
							store.set('isDarkMode', false);
						} else {
							store.set('isDarkMode', true);
						}
						darkMode();
						
						tray = Tray(icon);
						tray.setContextMenu(trayMenu);
					}
				}
			]
		}
	]);

	if (store.get('isDarkMode') == true) {
		appMenu.items[1].submenu.items[0].checked = true;
	} else {
		appMenu.items[1].submenu.items[0].checked = false;
	}

	darkMode();
	tray = Tray(icon);
	tray.setContextMenu(trayMenu);
	Menu.setApplicationMenu(appMenu);

}

function createWindow() {
	if(!singleInstanceLock) {
		appQuiting = true;
		app.quit();
		
	} else {
		app.on('second-instance', (event, commandLine, workingDirectory) => {
			if (win) {
				win.show();
			}
		})
		
		win = new BrowserWindow({
			autoHideMenuBar: true,
			width: 1024,
			height: 600,
			minWidth: 940,
			minHeight: 540,
			backgroundColor: '#202225',
			icon: 'src/icon.png',
			title: "ChimeraCord",
			defaultFontFamily: 'sansSerif',
			webPrefrences: {
				contextIsolation: true, 
				nodeIntegration: true,
			}
		})

		initWindow();
	}
}

app.on("ready", createWindow);
app.on("activate", createWindow)
