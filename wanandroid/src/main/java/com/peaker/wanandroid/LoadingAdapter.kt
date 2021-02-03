package com.peaker.wanandroid

import android.view.LayoutInflater
import android.view.ViewGroup
import com.dylanc.loadinghelper.LoadingHelper


class LoadingAdapter : LoadingHelper.Adapter<LoadingHelper.ViewHolder>() {

    private val height = ViewGroup.LayoutParams.MATCH_PARENT
    override fun onBindViewHolder(holder: LoadingHelper.ViewHolder) {

        val layoutParams: ViewGroup.LayoutParams = holder.rootView.layoutParams
        layoutParams.height = height
        holder.rootView.layoutParams = layoutParams
    }

    override fun onCreateViewHolder(
        inflater: LayoutInflater,
        parent: ViewGroup
    ): LoadingHelper.ViewHolder =
        LoadingHelper.ViewHolder(inflater.inflate(R.layout.layout_loading, parent, false))


}
