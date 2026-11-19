defmodule PicWeb.ErrorHTML do
  @moduledoc """
  Renders errors for HTML requests that reach the Phoenix router (see config/config.exs) as plain
  text: "404.html" becomes "Not Found".
  """

  def render(template, _assigns) do
    Phoenix.Controller.status_message_from_template(template)
  end
end
