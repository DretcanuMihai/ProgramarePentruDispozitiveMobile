package com.ilazar.myservices.util

import android.content.Context
import android.util.Log
import androidx.work.Worker
import androidx.work.WorkerParameters
import androidx.work.workDataOf
import java.util.concurrent.TimeUnit.SECONDS

class MyWorker(
    context: Context,
    val workerParams: WorkerParameters
) : Worker(context, workerParams) {
    override fun doWork(): Result {
        // perform long running operation

        var s = 0
        while (true) {
            setProgressAsync(workDataOf("secondsInApp" to s))
            SECONDS.sleep(1)
            s++
        }
        return Result.success(workDataOf("secondsInApp" to s))
    }
}