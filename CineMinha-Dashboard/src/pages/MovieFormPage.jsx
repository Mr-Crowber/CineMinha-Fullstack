
import { useEffect, useState } from "react";
import { adminService } from "../services";
import { assetUrl } from "../utils/assets";
import Icon from "../components/Icon";
import {
  Button,
  Field,
  PageHeader,
  SelectInput,
  TextArea,
  TextInput,
} from "../components/ui";

const emptyMovie = {
  title: "",
  genre: "TERROR",
  duration: "01H 30MIN",
  rating: "16 ANOS",
  description: "",
  poster: null,
  heroImage: null,
  heroTitle: "",
  heroAccent: "",
  year: "",
  director: "",
  status: "Rascunho",
  featured: false,
};

function UploadCard({
  label,
  description,
  preview,
  onChange,
  fileName,
  kind,
}) {
  return (
    <div className="upload-card">
      <div
        className={`upload-preview ${
          kind === "poster" ? "poster-preview" : "banner-preview"
        }`}
      >
        {preview ? (
          <img src={preview} alt="Pré-visualização do arquivo" />
        ) : (
          <div>
            <Icon name="image" size={23} />
            <span>
              {kind === "poster" ? "Pôster vertical" : "Imagem horizontal"}
            </span>
          </div>
        )}
      </div>

      <div className="upload-info">
        <strong>{label}</strong>
        <p>{description}</p>

        {fileName && <small className="selected-file">{fileName}</small>}

        <label className="button button-secondary button-sm upload-button">
          <Icon name="upload" size={15} />
          <span>
            Selecionar arquivo
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={onChange}
            />
          </span>
        </label>
      </div>
    </div>
  );
}

export default function MovieFormPage({ navigate, movieId }) {
  const isEdit = Boolean(movieId);

  const [form, setForm] = useState(emptyMovie);
  const [posterPreview, setPosterPreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");
  const [posterName, setPosterName] = useState("");
  const [bannerName, setBannerName] = useState("");
  const [posterFile, setPosterFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!isEdit) return;

    adminService
      .getMovie(movieId)
      .then((movie) => {
        if (!movie) return;

        setForm({
          title: movie.title,
          genre: movie.genre,
          duration: movie.duration,
          rating: movie.rating,
          description: movie.description,
          poster: movie.poster ?? null,
          heroImage: movie.heroImage ?? null,
          heroTitle: movie.heroTitle ?? "",
          heroAccent: movie.heroAccent ?? "",
          year: movie.year ? String(movie.year) : "",
          director: movie.director ?? "",
          status: movie.status ?? "Publicado",
          featured: Boolean(movie.featured),
        });

        setPosterPreview(assetUrl(movie.poster));
        setBannerPreview(assetUrl(movie.heroImage));
      })
      .catch((err) => {
        console.error("Erro ao carregar filme:", err);
        setError("Não foi possível carregar os dados do filme.");
      });
  }, [isEdit, movieId]);

  const set = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const setImage = (setter, nameSetter, fileSetter) => (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setter(URL.createObjectURL(file));
    nameSetter(file.name);
    fileSetter(file);
  };

  const handleSubmit = async (event) => {
  event.preventDefault();

  setSubmitting(true);
  setError("");
  setSuccess("");

  try {
    const payload = { ...form, year: form.year ? Number(form.year) : null };

    // Envia o cartaz para o backend
    if (posterFile) {
      const uploaded = await adminService.uploadImage(posterFile);
      payload.poster = uploaded.url;
    }

    // Envia o banner para o backend
    if (bannerFile) {
      const uploaded = await adminService.uploadImage(bannerFile);
      payload.heroImage = uploaded.url;
    }

    // Salva ou atualiza o filme
    if (isEdit) {
      await adminService.updateMovie(movieId, payload);
    } else {
      await adminService.createMovie(payload);
    }

    setSuccess(
      isEdit
        ? "Filme atualizado com sucesso!"
        : "Filme cadastrado com sucesso!"
    );

    // Limpa o formulário após cadastrar
    if (!isEdit) {
      setForm({ ...emptyMovie });
      setPosterPreview("");
      setBannerPreview("");
      setPosterName("");
      setBannerName("");
      setPosterFile(null);
      setBannerFile(null);
    }

  } catch (err) {
    console.error("Erro ao salvar filme:", err);
    setError(err.message || "Não foi possível salvar o filme.");
  } finally {
    setSubmitting(false);
  }
};
  return (
    <>
      <PageHeader
        eyebrow="CATÁLOGO / FILMES"
        title={isEdit ? "Editar filme" : "Cadastrar filme"}
        description={
          isEdit
            ? "Atualize as informações do título."
            : "Preencha as informações do novo filme no CineMinha."
        }
        actions={
          <Button
            variant="secondary"
            icon="left"
            onClick={() => navigate("/filmes")}
          >
            Voltar ao catálogo
          </Button>
        }
      />

      <form className="movie-form" onSubmit={handleSubmit}>
        <div className="form-main-column">
          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="form-success" role="status">
              {success}
            </div>
          )}

          <section className="panel form-section">
            <div className="form-section-header">
              <div className="form-section-number">01</div>
              <div>
                <h2>Informações principais</h2>
                <p>
                  Dados básicos do filme e campos utilizados pelo aplicativo
                  mobile.
                </p>
              </div>
            </div>

            <div className="form-grid two-columns">
              <TextInput
                label="Título do filme"
                required
                value={form.title}
                onChange={set("title")}
                placeholder="Ex.: Alien: Romulus"
              />

              <TextInput
                label="Ano de lançamento"
                type="number"
                value={form.year}
                onChange={set("year")}
                placeholder="Ex.: 2026"
              />

              <TextInput
                label="Diretor"
                value={form.director}
                onChange={set("director")}
                placeholder="Nome do diretor"
              />

              <SelectInput
                label="Gênero principal"
                required
                value={form.genre}
                onChange={set("genre")}
                options={[
                  "AÇÃO",
                  "ANIMAÇÃO",
                  "COMÉDIA",
                  "DRAMA",
                  "FICÇÃO",
                  "TERROR",
                ]}
              />

              <TextInput
                label="Duração"
                required
                value={form.duration}
                onChange={set("duration")}
                placeholder="01H 59MIN"
              />

              <SelectInput
                label="Classificação indicativa"
                required
                value={form.rating}
                onChange={set("rating")}
                options={[
                  "LIVRE",
                  "10 ANOS",
                  "12 ANOS",
                  "14 ANOS",
                  "16 ANOS",
                  "18 ANOS",
                ]}
              />
            </div>

            <TextArea
              label="Sinopse"
              required
              value={form.description}
              onChange={set("description")}
              rows={5}
              placeholder="Escreva uma breve sinopse para apresentar o filme aos usuários..."
              hint="Este texto corresponde ao campo description usado no app atual."
            />
          </section>

          <section className="panel form-section">
            <div className="form-section-header">
              <div className="form-section-number">02</div>
              <div>
                <h2>Identidade visual</h2>
                <p>
                  Arquivos exibidos na listagem, no detalhe e no destaque do
                  aplicativo.
                </p>
              </div>
            </div>

            <div className="form-grid upload-grid">
              <UploadCard
                label="Pôster do filme"
                description="Formato vertical · JPG, PNG ou WEBP"
                kind="poster"
                preview={posterPreview}
                fileName={posterName}
                onChange={setImage(
                  setPosterPreview,
                  setPosterName,
                  setPosterFile
                )}
              />

              <UploadCard
                label="Banner / Hero"
                description="Formato horizontal · JPG, PNG ou WEBP"
                kind="banner"
                preview={bannerPreview}
                fileName={bannerName}
                onChange={setImage(
                  setBannerPreview,
                  setBannerName,
                  setBannerFile
                )}
              />
            </div>

            <div className="form-grid two-columns hero-title-fields">
              <TextInput
                label="Texto principal do banner"
                value={form.heroTitle}
                onChange={set("heroTitle")}
                placeholder="Ex.: ALIEN:"
              />

              <TextInput
                label="Texto de destaque do banner"
                value={form.heroAccent}
                onChange={set("heroAccent")}
                placeholder="Ex.: ROMULUS"
              />
            </div>
          </section>

          <section className="panel form-section">
            <div className="form-section-header">
              <div className="form-section-number">03</div>
              <div>
                <h2>Publicação</h2>
                <p>Defina como o título será classificado no painel.</p>
              </div>
            </div>

            <div className="form-grid two-columns">
              <SelectInput
                label="Status do catálogo"
                value={form.status}
                onChange={set("status")}
                options={["Rascunho", "Publicado", "Arquivado"]}
              />

              <Field
                label="Destaque na página inicial"
                hint="Marque o filme para destacá-lo na página inicial do aplicativo."
              >
                <button
                  type="button"
                  className={`toggle-row ${
                    form.featured ? "toggle-on" : ""
                  }`}
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      featured: !current.featured,
                    }))
                  }
                >
                  <span className="toggle-switch">
                    <i />
                  </span>
                  <span>
                    {form.featured
                      ? "Marcado como destaque"
                      : "Não está em destaque"}
                  </span>
                </button>
              </Field>
            </div>
          </section>

          <div className="form-actions">
            <Button
              variant="secondary"
              onClick={() => navigate("/filmes")}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              icon="check"
              disabled={submitting}
            >
              {submitting
                ? "Salvando..."
                : isEdit
                  ? "Salvar alterações"
                  : "Cadastrar filme"}
            </Button>
          </div>
        </div>

        <aside className="form-side-column">
          <section className="panel form-help-panel">
            <div className="help-icon">
              <Icon name="info" size={19} />
            </div>

            <h3>Campos alinhados ao app</h3>

            <p>
              O formulário preserva os nomes dos campos do modelo de filme já
              existente no CineMinha.
            </p>

            <ul>
              <li><code>title</code> e <code>genre</code></li>
              <li><code>duration</code> e <code>rating</code></li>
              <li><code>description</code></li>
              <li><code>poster</code> e <code>heroImage</code></li>
              <li><code>heroTitle</code> e <code>heroAccent</code></li>
            </ul>
          </section>
        </aside>
      </form>
    </>
  );
}
