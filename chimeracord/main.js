const { app, BrowserWindow, Tray, nativeImage, Menu, shell, globalShortcut, remote, ipcRenderer, ipcMain, desktopCapturer} = require('electron');
const contextMenu = require('electron-context-menu');
const Store = require('electron-store');

contextMenu({ 
	showCopyImageAddress: true, 
	showSaveImageAs: true,
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
let webSecurity = true;
let tray;
let trayMenu;
let icon
let win;

app.enableSandbox();

function darkMode() {
	if (!store.get('isDarkMode')) {
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

function loadPage(givenURL) {
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

			div.item-3mHhwr.item-3XjbnG.selected-g-kMVV.themed-2-lozF, div.item-3mHhwr.item-3XjbnG.selected-g-kMVV.themed-2-lozF:hover {
				background-color: #0000;
				color: var(--text-normal);
				font-weight: 1000;
			}

			div.item-3mHhwr.item-3XjbnG.themed-2-lozF:hover {
				background-color: #0000;
				color: var(--text-normal);
				font-weight: 600;
			}

			button.button-f2h6uQ.lookLink-15mFoz.lowSaturationUnderline-Z6CW6z.colorPrimary-2AuQVo.sizeMedium-2bFIHr.grow-2sR_-F {
				color: var(--text-muted);
				font-weight: 1000;
			}

			div.itemCard-3Etziu.wrapper-2RrXDg.outer-2JOHae.padded-2NSY6O.interactive-2zD88a {
				background-color: var(--background-primary);
				--parent-color-itemCard-3ETziu-wrapper-2RrXDg-outer-2JOHae-padded-2NSY6O-interactive-2zD88a: var(--background-primary);
			}

			div.itemCard-3Etziu.wrapper-2RrXDg.outer-2JOHae.padded-2NSY6O.interactive-2zD88a:hover {
				background-color: var(--background-tertiary);
				--parent-color-itemCard-3ETziu-wrapper-2RrXDg-outer-2JOHae-padded-2NSY6O-interactive-2zD88a: var(--background-tertiary);
			}

			div.itemCard-3Etziu.wrapper-2RrXDg.outer-2JOHae.padded-2NSY6O.interactive-2zD88a div.body-16rSsp section.section-3G9aLW {
				background-color: var(--parent-color-itemCard-3ETziu-wrapper-2RrXDg-outer-2JOHae-padded-2NSY6O-interactive-2zD88a);
			}

			div.itemCard-3Etziu.wrapper-2RrXDg.outer-2JOHae.padded-2NSY6O.interactive-2zD88a .inset-SbsSFp {
				background-color: #0000;
			}

			div.peopleListItem-u6dGxF {
				background-color: var(--background-primary);
				border: 0px;
			}

			div.peopleListItem-u6dGxF:hover {
				background-color: var(--background-tertiary);
			}

			li.containerDefault-YUSmu3.selected-2TbFuo div.content-1gYQeQ, li.containerDefault-YUSmu3 div.content-1gYQeQ:hover, li.channel-1Shao0.container-32HW5s div.interactive-1vLZ_I.interactive-iyXY_x.interactiveSelected-29CP8y.selected-3veCBZ, li.channel-1Shao0.container-32HW5s div.interactive-1vLZ_I.interactive-iyXY_x:hover {
				background-color: var(--background-tertiary);
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
	win.loadURL(givenURL);
}

function initWindow() {
	appQuiting = false;
	win.webContents.setUserAgent(userAgent);
	loadPage('https://discord.com/app');
	
	win.webContents.openDevTools();
	win.on('close', e => {
		if(!appQuiting) {
			event.preventDefault();
			win.hide();
		} else {
			app.quit();
		}
	})

	win.webContents.on("new-window", function(event, url) {
		if(url.startsWith("file:")) {
			webSecurity = false;
		} else { 
			event.preventDefault();

			if(!url.startsWith("https://discord.com/")) {
				shell.openExternal(url);
			} else {
				return;
			}
		}
	})

	win.webContents.on("page-favicon-updated", (event, favicons) => {
		if(favicons.includes("data:image/png;base64,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")) {
			icon.setImage("src/tray-icon.png");
		} else {
			icon.setImage("src/tray-icon2.png");
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
						store.set('isDarkMode', !store.get('isDarkMode'));
						darkMode();
						
						tray = Tray(icon);
						tray.setContextMenu(trayMenu);
					}
				}
			]
		}
	]);

	if (store.get('isDarkMode')) {
		appMenu.items[1].submenu.items[0].checked = true;
	} else {
		appMenu.items[1].submenu.items[0].checked = false;
	}

	darkMode();
	tray = Tray(icon);
	tray.setContextMenu(trayMenu);
	Menu.setApplicationMenu(appMenu);

}

async function createWindow() {
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
				webSecurity: webSecurity,
				enableRemoteModule: true
			}
		})

		initWindow();

	}
}

app.on("ready", createWindow);
app.on("activate", createWindow)
