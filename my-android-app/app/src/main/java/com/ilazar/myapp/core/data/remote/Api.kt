package com.ilazar.myapp.core.data.remoteimport com.google.gson.GsonBuilderimport okhttp3.OkHttpClientimport retrofit2.Retrofitimport retrofit2.converter.gson.GsonConverterFactoryobject Api {    private val url = "192.168.43.145:3000" //hotspot//    private val url = "192.168.100.23:3000" //acasa2    private val httpUrl = "http://$url/"    val wsUrl = "ws://$url"    private var gson = GsonBuilder()        .setLenient()        .create()    val tokenInterceptor = TokenInterceptor()    val okHttpClient = OkHttpClient.Builder().apply {        this.addInterceptor(tokenInterceptor)    }.build()    val retrofit = Retrofit.Builder()        .baseUrl(httpUrl)        .addConverterFactory(GsonConverterFactory.create(gson))        .client(okHttpClient)        .build()}