export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const clientPass = body.password || "";

    // 读取在 Cloudflare Pages 后台配置的环境变量 ACCESS_PASSWORD
    const serverPass = env.ACCESS_PASSWORD;

    // 如果未设置环境变量，默认允许通过，但给出提示
    if (!serverPass) {
      return new Response(JSON.stringify({ 
        ok: true, 
        warning: "未在 Cloudflare 后台设置 ACCESS_PASSWORD 变量，已开启免密访问" 
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // 校验输入密码
    if (clientPass === serverPass) {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { "Content-Type": "application/json" }
      });
    } else {
      return new Response(JSON.stringify({ ok: false, message: "密码错误，拒绝访问" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, message: "鉴权请求异常" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
