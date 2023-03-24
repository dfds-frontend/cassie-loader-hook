declare var CassieWidgetLoaderModule: any

type CassieWidgetLoader = { some: number } | undefined

export {}

declare global {
  interface Window {
    CassieWidgetLoader: CassieWidgetLoader
  }
}

var cassieLoaderScript = document.createElement('script')
var cdnUrl = 'https://cscript-cdn-irl'.concat(
  // @ts-ignore
  process.env.GATSBY_CASSIE_ENVIRONMENT === 'production' ? '' : '-uat',
  '.cassiecloud.com/loader.js'
)
cassieLoaderScript.src = cdnUrl
document.head.appendChild(cassieLoaderScript)

var cassieSettings = {
  widgetProfileId: 1,
  languageCode: '${localeLower}',
  region: 'irl',
  licenseKey: '${process.env.GATSBY_CASSIE_LICENSEKEY}',
  environment: '${process.env.GATSBY_CASSIE_ENVIRONMENT}',
}
// @ts-ignore
new Promise(function (resolve, reject) {
  cassieLoaderScript.onload = function () {
    if (typeof CassieWidgetLoaderModule !== 'undefined') {
      if (!window.CassieWidgetLoader) {
        window.CassieWidgetLoader = new CassieWidgetLoaderModule(cassieSettings)
      }

      document.addEventListener(
        'CassieTemplateInitialized',
        function () {
          addStrictlyNecessaryToggleSwitch()
          autoToggleBasedOnConsent()
          toggleWidgetWithParam()
        },
        { once: true }
      )
      // @ts-ignore
      function addStrictlyNecessaryToggleSwitch() {
        var strictlyNecessaryGroup = document.getElementById(
          'cassie_strictly_necessary'
        )
        var strictlyNecessaryGroupHeader =
          strictlyNecessaryGroup?.querySelector(
            '.cassie-cookie-modal--group-head-container'
          )
        var strictlyNecessarySwitch = document.createElement('div')
        strictlyNecessarySwitch.classList.add(
          'cassie-toggle-switch',
          'cassie-cookie-group--toggle-switch'
        )
        strictlyNecessarySwitch.role = 'switch'
        // @ts-ignore
        strictlyNecessarySwitch.disabled = true
        // @ts-ignore
        strictlyNecessarySwitch.ariaDisabled = true
        // @ts-ignore
        strictlyNecessarySwitch.checked = true

        strictlyNecessaryGroupHeader?.insertBefore(
          strictlyNecessarySwitch,
          strictlyNecessaryGroupHeader.children[1]
        )

        var strictlyNecessarySwitchSlider = document.createElement('span')
        strictlyNecessarySwitchSlider.classList.add(
          'cassie-toggle-switch--slider',
          'cassie-cookie-group--toggle-switch--slider',
          'cassie-toggle-switch--slider--active'
        )

        strictlyNecessarySwitch.appendChild(strictlyNecessarySwitchSlider)

        // prevent accept all from toggling the new toggle switch off
        var acceptAllToggleSwitch = document.getElementById(
          'cassie_accept_all_toggle_switch'
        )
        // @ts-ignore
        acceptAllToggleSwitch.addEventListener('click', function () {
          strictlyNecessarySwitchSlider.classList.add(
            'cassie-toggle-switch--slider--active'
          )
          // @ts-ignore
          strictlyNecessarySwitch.checked = true
        })
      }
      // @ts-ignore
      function autoToggleBasedOnConsent() {
        // @ts-ignore
        var hasConsent = CassieWidgetLoader?.Widget?.widgetTemplate?.hasConsent

        if (!hasConsent) {
          var allToggles = document.querySelectorAll(
            '.cassie-child-cookie--toggle-switch--slider'
          )
          allToggles.forEach((toggle) => {
            toggle.classList.add('cassie-toggle-switch--slider--active')
          })
        }
      }
      // @ts-ignore
      function toggleWidgetWithParam() {
        const appConsent = new URLSearchParams(window.location.search).get(
          'app_consent'
        )
        if (appConsent === 'false' || appConsent === 'true') {
          // @ts-ignore
          CassieWidgetLoader.Widget.hideModal()
        }
      }
    }
  }
})
