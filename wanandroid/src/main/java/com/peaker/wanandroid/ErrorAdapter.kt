package com.peaker.wanandroid

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.dylanc.loadinghelper.LoadingHelper

class ErrorAdapter : LoadingHelper.Adapter<ErrorAdapter.ViewHolder>() {



    class ViewHolder(rootView: View) : LoadingHelper.ViewHolder(rootView)

    override fun onBindViewHolder(holder: ViewHolder) {
        holder.rootView.setOnClickListener {
            if (holder.onReloadListener != null) {
                holder.onReloadListener!!.onReload()
            }
        }
    }

    override fun onCreateViewHolder(inflater: LayoutInflater, parent: ViewGroup): ViewHolder =ViewHolder(inflater.inflate(R.layout.layout_error, parent, false))
}