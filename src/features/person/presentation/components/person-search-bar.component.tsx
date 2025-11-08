"use client";

import React, { useState, useEffect } from 'react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Search, X } from 'lucide-react';

interface PersonSearchBarProps {
	onSearch: (busqueda: string) => void;
	onClear: () => void;
	isSearching: boolean;
	searchTerm: string;
}

export function PersonSearchBar({ onSearch, onClear, isSearching, searchTerm }: PersonSearchBarProps) {
	const [busqueda, setBusqueda] = useState(searchTerm);

	useEffect(() => {
		setBusqueda(searchTerm);
	}, [searchTerm]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (busqueda.trim().length >= 2) {
			onSearch(busqueda.trim());
		}
	};

	const handleClear = () => {
		setBusqueda('');
		onClear();
	};

	return (
		<div className="rounded-lg border bg-card p-4">
			<form onSubmit={handleSubmit} className="flex gap-2">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
					<Input
						type="text"
						placeholder="Buscar por cédula, nombres o apellidos..."
						value={busqueda}
						onChange={(e) => setBusqueda(e.target.value)}
						className="pl-9"
					/>
				</div>
				{searchTerm && (
					<Button
						type="button"
						variant="outline"
						size="icon"
						onClick={handleClear}
					>
						<X className="w-4 h-4" />
					</Button>
				)}
				<Button
					type="submit"
					disabled={busqueda.trim().length < 2 || isSearching}
				>
					<Search className="w-4 h-4" />
					{isSearching ? 'Buscando...' : 'Buscar'}
				</Button>
			</form>
		</div>
	);
}

