package com.peaker.wanandroid

class ette : ArrayList<etteItem>()

data class etteItem(
    var createTime: String = "",
    var creatorId: Int = 0,
    var creatorName: String = "",
    var delFlag: Boolean = false,
    var id: Int = 0,
    var ids: String = "",
    var itemName: String = "",
    var lat: String = "",
    var lng: String = "",
    var orgId: Int = 0,
    var patrolFlag: String = "",
    var problemIds: String = "",
    var projectCode: String = "",
    var type: String = "",
    var updateTime: Any? = null,
    var updatorId: Any? = null,
    var wsPatrolProblems: List<WsPatrolProblem> = listOf()
)

data class WsPatrolProblem(
    var createTime: String = "",
    var creatorId: Any? = null,
    var creatorName: String = "",
    var delFlag: Boolean = false,
    var id: Int = 0,
    var name: String = "",
    var updateTime: Any? = null,
    var updatorId: Any? = null
)