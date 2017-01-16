package ${package_name}$;

import android.app.Activity;
import android.content.Intent;
import android.view.ViewGroup;

import com.yy.android.small.pluginbase.IPluginEntryPoint;
import com.yy.android.small.pluginbase.IPluginManager;
import com.yy.mobile.util.log.MLog;

public enum PluginEntryPoint implements IPluginEntryPoint {
    INSTANCE;

    private IPluginManager mPluginManager;

    @Override
    public void initialize(IPluginManager manager) {
        MLog.info(this, "[com.yy.mobile.demo.PluginEntryPoint] initialize()" + manager);
        mPluginManager = manager;
    }

    @Override
    public void mainEntry(Intent intent, Activity activity, ViewGroup parentView) {
        MLog.info(this, "[com.yy.mobile.demo.PluginEntryPoint] mainEntry()" + intent);
        String action = intent.getAction();
        if (action == null) {
            return;
        }
        MLog.info(this, String.format("[com.yy.mobile.demo.PluginEntryPoint] mainEntry(), action = [%s]", action));
        if ("DEMO_ACTION_TEST".equals(action)) {
            Intent main = new Intent(activity, DemoMainActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
            intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
            activity.startActivity(main);
        }
    }

    @Override
    public void terminate(IPluginManager manager) {
        MLog.info(this, "[com.yy.mobile.demo.PluginEntryPoint] terminate()" + manager);
        mPluginManager = null;
    }
}