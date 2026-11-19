defmodule PicWeb.HomePage do
  @moduledoc """
  A placeholder at /, showing Hologram is wired up: the button's action runs in the browser.
  The React app in ../frontend is still the product; this backend's job so far is /api.
  """

  use Hologram.Page

  route "/"

  layout PicWeb.MainLayout

  def init(_params, component, _server) do
    put_state(component, :clicks, 0)
  end

  def template do
    ~HOLO"""
    <main style="font-family: system-ui, sans-serif; max-width: 40rem; margin: 3rem auto; padding: 0 1rem;">
      <h1>pic backend</h1>
      <p>Phoenix + Hologram, with the API under <a href="/api/health">/api</a>.</p>
      <button $click="increment">Clicked {@clicks} times</button>
    </main>
    """
  end

  def action(:increment, _params, component) do
    put_state(component, :clicks, component.state.clicks + 1)
  end
end
