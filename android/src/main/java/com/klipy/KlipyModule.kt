package com.klipy

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = KlipyModule.NAME)
class KlipyModule(reactContext: ReactApplicationContext) : NativeKlipySpec(reactContext) {

  companion object {
    const val NAME = "Klipy"
    @JvmStatic
    var apiKey: String? = null
  }

  override fun getName() = NAME

  override fun initialize(apiKey: String, options: ReadableMap?, promise: Promise) {
    Companion.apiKey = apiKey
    // TODO: Use apiKey to configure your Klipy networking layer (base URL, etc.)
    promise.resolve(null)
  }

  override fun open(promise: Promise) {
    val activity = currentActivity
    if (activity == null) {
      promise.reject("KLIPY_NO_ACTIVITY", "No current activity to present Klipy UI")
      return
    }

    // TODO: Replace with real Klipy UI integration.
    // For now this is just a stub entry point that you can connect to
    // a dedicated Activity/Fragment/Compose screen similar to the demo app.

    promise.resolve(null)
  }

  override fun addListener(eventName: String?) {
    // Required for NativeEventEmitter
  }

  override fun removeListeners(count: Double) {
    // Required for NativeEventEmitter
  }
}
