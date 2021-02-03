package com.example.kotlindemo

import android.os.Bundle
import android.view.KeyEvent
import android.view.View
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity
import kotlinx.android.synthetic.main.activity_web.*


class WebActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_web)

        initView()

        btn.setOnClickListener {
//            webView.goBack()
            webView.loadUrl("javascript:goBack(1)")
        }
        btn2.setOnClickListener {
            webView.loadUrl("https://home.firefoxchina.cn")
        }
    }

    private fun initView() {
        // 支持App内部javascript交互
        webView.getSettings().setJavaScriptEnabled(true)
        // 自适应屏幕
        webView.getSettings().setLayoutAlgorithm(WebSettings.LayoutAlgorithm.SINGLE_COLUMN)
        webView.getSettings().setLoadWithOverviewMode(true)

        // 设置可以支持缩放
        webView.getSettings().setSupportZoom(true)
        // 扩大比例的缩放
        webView.getSettings().setUseWideViewPort(true)
        // 设置是否出现缩放工具
        webView.getSettings().setBuiltInZoomControls(true)
        webView.getSettings().setDomStorageEnabled(true)
        webView.getSettings().setAllowFileAccess(true)
        webView.getSettings().setAllowContentAccess(true)
        webView.getSettings().setAllowFileAccessFromFileURLs(true)
        webView.getSettings().setAllowUniversalAccessFromFileURLs(true) // 跨域页面跳转
        webView.setWebViewClient(WebViewClient())
        // 设置编码方式
        webView.getSettings().setDefaultTextEncodingName("utf-8")
        webView.setWebChromeClient(WebChromeClient())

        // 通过addJavascriptInterface()将Java对象映射到JS对象
        // 参数1：Javascript对象名
        // 参数2：Java对象名

//        webView.loadUrl("https://home.firefoxchina.cn") // file:////android_asset/index.html
        webView.loadUrl("file:////android_asset/pages/index.html")

       /* webView.setOnKeyListener(View.OnKeyListener { v, keyCode, event ->
            if (event.getAction() == KeyEvent.ACTION_DOWN) {
                //按返回键操作并且能回退网页
                if (keyCode == KeyEvent.KEYCODE_BACK && webView.canGoBack()) {
                    //后退
                    webView.loadUrl("javascript:goBack(1)")
                    true
                }
            }
            false


        })*/
        /* webView.setOnKeyListener(new View.OnKeyListener() {
             @Override
             public boolean onKey(View v, int keyCode, KeyEvent event) {
                 if (event.getAction() == KeyEvent.ACTION_DOWN) {
                     //按返回键操作并且能回退网页
                     if (keyCode == KeyEvent.KEYCODE_BACK && webView.canGoBack()) {
                         //后退
                         webView.goBack();
                         return true;
                     }
                 }
                 return false;

             }
         });*/
    }

    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {


        if (keyCode == KeyEvent.KEYCODE_BACK) {

            webView.loadUrl("javascript:goBack(1)")


            return true
        }
        return false

    }

}
