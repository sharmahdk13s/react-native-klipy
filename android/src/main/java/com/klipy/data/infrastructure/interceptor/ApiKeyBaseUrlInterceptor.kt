package com.klipy.data.infrastructure.interceptor

import com.klipy.KlipyModule
import okhttp3.HttpUrl
import okhttp3.Interceptor
import okhttp3.Response

/**
 * Ensures the Klipy API key is always part of the base URL path on Android
 * without requiring Retrofit / Koin to be rebuilt when the key changes.
 *
 * Expected base URL: https://api.klipy.com/api/v1/
 * Final URL:         https://api.klipy.com/api/v1/{apiKey}/<rest-of-path>
 */
class ApiKeyBaseUrlInterceptor : Interceptor {

  override fun intercept(chain: Interceptor.Chain): Response {
    val originalRequest = chain.request()
    val originalUrl = originalRequest.url

    val apiKey = KlipyModule.apiKey.orEmpty()
    if (apiKey.isEmpty()) {
      return chain.proceed(originalRequest)
    }

    // Only rewrite URLs under the /api/v1/ prefix to avoid affecting
    // any other potential hosts or paths.
    if (!originalUrl.encodedPath.startsWith("/api/v1/")) {
      return chain.proceed(originalRequest)
    }

    val newUrl = buildUrlWithApiKey(originalUrl, apiKey)
    val newRequest = originalRequest.newBuilder().url(newUrl).build()
    return chain.proceed(newRequest)
  }

  private fun buildUrlWithApiKey(url: HttpUrl, apiKey: String): HttpUrl {
    val segments = url.pathSegments
    if (segments.size < 2) return url

    // Example segments for baseUrl "https://api.klipy.com/api/v1/" and
    // path "gifs/trending": ["api", "v1", "gifs", "trending"]
    val rebuilt = mutableListOf<String>()
    rebuilt.add(segments[0]) // "api"
    rebuilt.add(segments[1]) // "v1"

    // If the third segment is already the apiKey, avoid duplicating it.
    val startIndex = if (segments.size > 2 && segments[2] == apiKey) 3 else 2
    rebuilt.add(apiKey)
    for (i in startIndex until segments.size) {
      rebuilt.add(segments[i])
    }

    val newPath = "/" + rebuilt.joinToString("/")
    return url.newBuilder().encodedPath(newPath).build()
  }
}
