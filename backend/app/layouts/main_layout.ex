defmodule PicWeb.MainLayout do
  @moduledoc "The document every Hologram page renders into."

  use Hologram.Component

  alias Hologram.UI.Runtime

  def template do
    ~HOLO"""
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>pic</title>
        <Runtime />
      </head>
      <body>
        <slot />
      </body>
    </html>
    """
  end
end
