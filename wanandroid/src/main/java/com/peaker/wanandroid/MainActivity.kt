package com.peaker.wanandroid

import android.os.Bundle
import android.os.Handler
import com.dylanc.loadinghelper.LoadingHelper
import com.dylanc.loadinghelper.LoadingHelper.AdapterPool
import com.dylanc.loadinghelper.ViewType
import com.peaker.wanandroid.base.BaseActivity

class MainActivity : BaseActivity() {


    override fun initParmas(bundle: Bundle?) {


    }

    override fun initLayout(): Int = R.layout.activity_main

    override fun initView() {



       LoadingHelper.setDefaultAdapterPool {
            this.register(ViewType.LOADING, LoadingAdapter())
            this.register(ViewType.ERROR, ErrorAdapter())
//            this.register(ViewType.EMPTY, EmptyAdapter())

        }

        var loadingHelper = LoadingHelper(this)
        loadingHelper.register(ViewType.LOADING, LoadingAdapter())
//        loadingHelper.register(ViewType.LOADING,LoadingAdapter())
        loadingHelper.showView(ViewType.LOADING)

        loadingHelper.setOnReloadListener {
//            loadingHelper.showView(ViewType.LOADING)


        }


        Handler().postDelayed(Runnable {
            loadingHelper.showErrorView()
        }, 2000)
    }

    override fun initData() {

    }
}
