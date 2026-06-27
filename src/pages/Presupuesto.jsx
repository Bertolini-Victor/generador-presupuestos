import React, { useState, useEffect } from "react";
import "./Presupuesto.css";
import catalogoInicial from "../data/productos.json";

const dictionary = {
	es: {
		title: "PRESUPUESTO",
		newBudget: "Nuevo Presupuesto",
		date: "Fecha",
		catalog: "Catálogo de Servicios",
		searchPlaceholder: "Buscar servicio o categoría...",
		exportBtn: "Exportar a PDF",
		validity: "Válido por: 15 días",
		description: "Descripción del Servicio",
		qty: "Cant.",
		unitPrice: "Precio Unit.",
		subtotal: "Subtotal",
		total: "Total",
		empty: "Selecciona servicios del catálogo para armar el presupuesto.",
		myStudioData: "Mis Datos (Emisor)",
		studioName: "Nombre / Estudio",
		studioSpecialty: "Especialidad",
		studioEmail: "Email de contacto",
		studioWeb: "Sitio Web / Portfolio",
		langLabel: "Idioma del Documento",
		currencyLabel: "Moneda del Presupuesto",
		portfolioText: "Puedes ver mis proyectos y trabajos anteriores en: ",
		editCatalog: "⚙️ Editar",
	},
	en: {
		title: "ESTIMATE / BUDGET",
		newBudget: "New Estimate",
		date: "Date",
		catalog: "Service Catalog",
		searchPlaceholder: "Search service or category...",
		exportBtn: "Export to PDF",
		validity: "Valid for: 15 days",
		description: "Service Description",
		qty: "Qty.",
		unitPrice: "Unit Price",
		subtotal: "Subtotal",
		total: "Total",
		empty: "Select services from the catalog to build the estimate.",
		myStudioData: "My Info (Issuer)",
		studioName: "Name / Studio",
		studioSpecialty: "Specialty",
		studioEmail: "Contact Email",
		studioWeb: "Website / Portfolio",
		langLabel: "Document Language",
		currencyLabel: "Budget Currency",
		portfolioText: "You can view my projects and previous work at: ",
		editCatalog: "⚙️ Edit",
	},
};

const servicioVacio = {
	id: "",
	categoria: "",
	descripcion: { es: "", en: "" },
	detalle: { es: "", en: "" },
	precioBase: 0,
	precioUSD: 0,
};

const PresupuestoApp = () => {
	const [lang, setLang] = useState("es");
	const [currency, setCurrency] = useState("ARS");
	const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
	const [busqueda, setBusqueda] = useState("");
	const [items, setItems] = useState([]);

	const [miEmpresa, setMiEmpresa] = useState({
		nombre: "Victor H. Bertolini Agaras",
		especialidad: "Full-Stack Developer",
		email: "vhba0704@gmail.com",
		web: "",
	});

	const [catalogoLocal, setCatalogoLocal] = useState(() => {
		const catalogoGuardado = localStorage.getItem("miCatalogoServicios");
		if (catalogoGuardado) return JSON.parse(catalogoGuardado);
		return catalogoInicial;
	});

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingItem, setEditingItem] = useState(servicioVacio);
	const [modalMode, setModalMode] = useState("list");

	useEffect(() => {
		localStorage.setItem("miCatalogoServicios", JSON.stringify(catalogoLocal));
	}, [catalogoLocal]);

	const t = dictionary[lang];

	const getPrice = (item) =>
		currency === "ARS" ? item.precioBase : item.precioUSD;

	const formatPrice = (amount) => {
		if (currency === "ARS") return "$" + amount.toLocaleString("es-AR");
		return "u$s " + amount.toLocaleString("en-US");
	};

	const agregarItem = (producto) => {
		const itemExistente = items.find((i) => i.id === producto.id);
		if (itemExistente) {
			setItems(
				items.map((i) =>
					i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i,
				),
			);
		} else {
			setItems([...items, { ...producto, cantidad: 1 }]);
		}
	};

	const restarCantidad = (id) => {
		setItems(
			items
				.map((item) =>
					item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item,
				)
				.filter((item) => item.cantidad > 0),
		);
	};

	const eliminarItem = (id) => {
		setItems(items.filter((item) => item.id !== id));
	};

	const calcularTotal = () =>
		items.reduce((total, item) => total + getPrice(item) * item.cantidad, 0);

	const handlePrint = () => window.print();

	const productosFiltrados = catalogoLocal.filter(
		(prod) =>
			prod.descripcion[lang].toLowerCase().includes(busqueda.toLowerCase()) ||
			prod.categoria.toLowerCase().includes(busqueda.toLowerCase()),
	);

	const categoriasMap = productosFiltrados.reduce((acc, item) => {
		if (!acc[item.categoria]) acc[item.categoria] = [];
		acc[item.categoria].push(item);
		return acc;
	}, {});

	const guardarServicio = () => {
		if (modalMode === "add") {
			const nuevoItem = { ...editingItem, id: Date.now().toString() };
			setCatalogoLocal([...catalogoLocal, nuevoItem]);
		} else if (modalMode === "edit") {
			setCatalogoLocal(
				catalogoLocal.map((item) =>
					item.id === editingItem.id ? editingItem : item,
				),
			);
			setItems(
				items.map((i) =>
					i.id === editingItem.id
						? { ...editingItem, cantidad: i.cantidad }
						: i,
				),
			);
		}
		setModalMode("list");
	};

	const eliminarDelCatalogo = (id) => {
		if (
			window.confirm(
				"¿Estás seguro de eliminar este servicio del catálogo permanente?",
			)
		) {
			setCatalogoLocal(catalogoLocal.filter((item) => item.id !== id));
		}
	};

	return (
		<div className="app-container">
			<div className="sidebar no-print">
				<h2>{t.newBudget}</h2>
				<div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
					<div className="form-group">
						<label>{t.langLabel}</label>
						<div className="lang-toggle-container">
							<button
								className={`lang-btn ${lang === "es" ? "active" : ""}`}
								onClick={() => setLang("es")}>
								Español
							</button>
							<button
								className={`lang-btn ${lang === "en" ? "active" : ""}`}
								onClick={() => setLang("en")}>
								English
							</button>
						</div>
					</div>

					<div className="form-group">
						<label>{t.currencyLabel}</label>
						<div className="lang-toggle-container">
							<button
								className={`lang-btn ${currency === "ARS" ? "active" : ""}`}
								onClick={() => setCurrency("ARS")}>
								ARS ($)
							</button>
							<button
								className={`lang-btn ${currency === "USD" ? "active" : ""}`}
								onClick={() => setCurrency("USD")}>
								USD (u$s)
							</button>
						</div>
					</div>
				</div>

				<div className="sidebar-section-card">
					<h3>{t.myStudioData}</h3>
					<div className="form-group sm">
						<label>{t.studioName}</label>
						<input
							type="text"
							value={miEmpresa.nombre}
							onChange={(e) =>
								setMiEmpresa({ ...miEmpresa, nombre: e.target.value })
							}
						/>
					</div>
					<div className="form-group sm">
						<label>{t.studioSpecialty}</label>
						<input
							type="text"
							value={miEmpresa.especialidad}
							onChange={(e) =>
								setMiEmpresa({ ...miEmpresa, especialidad: e.target.value })
							}
						/>
					</div>
					<div className="form-group sm">
						<label>{t.studioEmail}</label>
						<input
							type="email"
							value={miEmpresa.email}
							onChange={(e) =>
								setMiEmpresa({ ...miEmpresa, email: e.target.value })
							}
						/>
					</div>
					<div className="form-group sm">
						<label>{t.studioWeb}</label>
						<input
							type="text"
							value={miEmpresa.web}
							placeholder="ej: victorbertolini.dev"
							onChange={(e) =>
								setMiEmpresa({ ...miEmpresa, web: e.target.value })
							}
						/>
					</div>
				</div>

				<div className="form-group">
					<label>{t.date}</label>
					<input
						type="date"
						value={fecha}
						onChange={(e) => setFecha(e.target.value)}
					/>
				</div>

				<div className="form-group">
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}>
						<label>{t.catalog}</label>
						<button
							className="btn-edit-catalog"
							onClick={() => {
								setModalMode("list");
								setIsModalOpen(true);
							}}>
							{t.editCatalog}
						</button>
					</div>

					<input
						type="text"
						className="search-input"
						placeholder={t.searchPlaceholder}
						value={busqueda}
						onChange={(e) => setBusqueda(e.target.value)}
					/>

					<div className="catalogo-list">
						{Object.keys(categoriasMap).map((cat) => (
							<details
								key={cat}
								className="catalogo-category"
								open={busqueda.length > 0 ? true : undefined}>
								<summary>{cat}</summary>
								<div className="category-items">
									{categoriasMap[cat].map((prod) => (
										<button
											key={prod.id}
											className="catalogo-btn"
											onClick={() => agregarItem(prod)}>
											<span>{prod.descripcion[lang]}</span>
											<strong>{formatPrice(getPrice(prod))}</strong>
										</button>
									))}
								</div>
							</details>
						))}
						{Object.keys(categoriasMap).length === 0 && (
							<p
								style={{
									fontSize: "0.85rem",
									color: "var(--text)",
									textAlign: "center",
								}}>
								No se encontraron servicios.
							</p>
						)}
					</div>
				</div>

				<button onClick={handlePrint} className="btn-imprimir">
					{t.exportBtn}
				</button>
			</div>

			<div className="preview-container">
				<div className="document-preview print-area">
					<header className="doc-header">
						<div className="brand-info">
							<h1>{miEmpresa.nombre || "MI ESTUDIO"}</h1>
							{miEmpresa.especialidad && <p>{miEmpresa.especialidad}</p>}
							{miEmpresa.email && <p>{miEmpresa.email}</p>}
						</div>
						<div className="meta-info">
							<h2>{t.title}</h2>
							<p>
								<strong>{t.date}:</strong> {fecha}
							</p>
							<p className="validity-text">{t.validity}</p>
						</div>
					</header>

					<main>
						<table className="tabla-presupuesto">
							<thead>
								<tr>
									<th style={{ width: "45%" }}>{t.description}</th>
									<th style={{ textAlign: "center", width: "10%" }}>{t.qty}</th>
									<th style={{ textAlign: "right", width: "20%" }}>
										{t.unitPrice}
									</th>
									<th style={{ textAlign: "right", width: "20%" }}>
										{t.subtotal}
									</th>
									<th className="no-print" style={{ width: "5%" }}></th>
								</tr>
							</thead>
							<tbody>
								{items.length === 0 ? (
									<tr>
										<td
											colSpan="5"
											style={{
												textAlign: "center",
												color: "#888",
												padding: "4rem 0",
											}}>
											{t.empty}
										</td>
									</tr>
								) : (
									items.map((item, index) => (
										<tr key={index}>
											<td>
												<div className="item-desc">
													{item.descripcion[lang]}
												</div>
												{item.detalle && (
													<div className="item-detail">
														{item.detalle[lang]}
													</div>
												)}
											</td>
											<td style={{ textAlign: "center" }}>
												<div className="qty-control">
													<button
														className="qty-btn no-print"
														onClick={() => restarCantidad(item.id)}>
														-
													</button>
													<span>{item.cantidad}</span>
													<button
														className="qty-btn no-print"
														onClick={() => agregarItem(item)}>
														+
													</button>
												</div>
											</td>
											<td style={{ textAlign: "right", color: "#4b5563" }}>
												{formatPrice(getPrice(item))}
											</td>
											<td
												style={{
													textAlign: "right",
													fontWeight: "600",
													color: "#111827",
												}}>
												{formatPrice(getPrice(item) * item.cantidad)}
											</td>
											<td className="no-print" style={{ textAlign: "center" }}>
												<button
													className="delete-btn"
													onClick={() => eliminarItem(item.id)}
													title="Eliminar ítem">
													✕
												</button>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</main>

					<footer className="total-section">
						<div className="total-content">
							<span className="total-label">{t.total}</span>
							<span className="total-amount">
								{formatPrice(calcularTotal())}
							</span>
						</div>
					</footer>

					{miEmpresa.web && (
						<div className="doc-footer-note">
							<p>
								{t.portfolioText} <strong>{miEmpresa.web}</strong>
							</p>
						</div>
					)}
				</div>
			</div>
			{isModalOpen && (
				<div className="modal-overlay no-print">
					<div className="modal-content">
						<div className="modal-header">
							<h2>Gestión del Catálogo</h2>
							<button
								className="modal-close"
								onClick={() => setIsModalOpen(false)}>
								✕
							</button>
						</div>

						{modalMode === "list" && (
							<>
								<button
									className="btn-add-service"
									onClick={() => {
										setEditingItem(servicioVacio);
										setModalMode("add");
									}}>
									+ Agregar Nuevo Servicio
								</button>
								<div className="modal-services-list">
									{catalogoLocal.map((prod) => (
										<div key={prod.id} className="modal-service-item">
											<div>
												<strong>{prod.descripcion.es}</strong>
												<span className="modal-service-cat">
													{prod.categoria}
												</span>
											</div>
											<div className="modal-actions">
												<button
													onClick={() => {
														setEditingItem(prod);
														setModalMode("edit");
													}}>
													✏️
												</button>
												<button onClick={() => eliminarDelCatalogo(prod.id)}>
													🗑️
												</button>
											</div>
										</div>
									))}
								</div>
							</>
						)}

						{(modalMode === "edit" || modalMode === "add") && (
							<div className="modal-form">
								<h3>
									{modalMode === "add" ? "Nuevo Servicio" : "Editar Servicio"}
								</h3>

								<div className="form-group sm">
									<label>Categoría (Ej: Frontend, SEO, etc.)</label>
									<input
										type="text"
										value={editingItem.categoria}
										onChange={(e) =>
											setEditingItem({
												...editingItem,
												categoria: e.target.value,
											})
										}
									/>
								</div>

								<div style={{ display: "flex", gap: "1rem" }}>
									<div className="form-group sm" style={{ flex: 1 }}>
										<label>Descripción (Español)</label>
										<input
											type="text"
											value={editingItem.descripcion.es}
											onChange={(e) =>
												setEditingItem({
													...editingItem,
													descripcion: {
														...editingItem.descripcion,
														es: e.target.value,
													},
												})
											}
										/>
									</div>
									<div className="form-group sm" style={{ flex: 1 }}>
										<label>Descripción (Inglés)</label>
										<input
											type="text"
											value={editingItem.descripcion.en}
											onChange={(e) =>
												setEditingItem({
													...editingItem,
													descripcion: {
														...editingItem.descripcion,
														en: e.target.value,
													},
												})
											}
										/>
									</div>
								</div>

								<div style={{ display: "flex", gap: "1rem" }}>
									<div className="form-group sm" style={{ flex: 1 }}>
										<label>Detalle (Español)</label>
										<textarea
											className="modal-textarea"
											value={editingItem.detalle.es}
											onChange={(e) =>
												setEditingItem({
													...editingItem,
													detalle: {
														...editingItem.detalle,
														es: e.target.value,
													},
												})
											}
										/>
									</div>
									<div className="form-group sm" style={{ flex: 1 }}>
										<label>Detalle (Inglés)</label>
										<textarea
											className="modal-textarea"
											value={editingItem.detalle.en}
											onChange={(e) =>
												setEditingItem({
													...editingItem,
													detalle: {
														...editingItem.detalle,
														en: e.target.value,
													},
												})
											}
										/>
									</div>
								</div>

								<div style={{ display: "flex", gap: "1rem" }}>
									<div className="form-group sm" style={{ flex: 1 }}>
										<label>Precio en ARS ($)</label>
										<input
											type="number"
											value={editingItem.precioBase}
											onChange={(e) =>
												setEditingItem({
													...editingItem,
													precioBase: Number(e.target.value),
												})
											}
										/>
									</div>
									<div className="form-group sm" style={{ flex: 1 }}>
										<label>Precio en USD (u$s)</label>
										<input
											type="number"
											value={editingItem.precioUSD}
											onChange={(e) =>
												setEditingItem({
													...editingItem,
													precioUSD: Number(e.target.value),
												})
											}
										/>
									</div>
								</div>

								<div className="modal-form-actions">
									<button
										className="btn-cancel"
										onClick={() => setModalMode("list")}>
										Cancelar
									</button>
									<button className="btn-save" onClick={guardarServicio}>
										Guardar
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default PresupuestoApp;
