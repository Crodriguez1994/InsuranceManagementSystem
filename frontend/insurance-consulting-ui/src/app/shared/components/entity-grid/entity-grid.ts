import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { GridConfig } from './entity-grid.models';

@Component({
    selector: 'app-entity-grid',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule
    ],
    templateUrl: './entity-grid.html',
    styleUrls: ['./entity-grid.scss']
})
export class EntityGridComponent<T extends Record<string, any>> implements AfterViewInit, OnChanges {
    @Input({ required: true }) config!: GridConfig<T>;
    @Input() data: T[] = [];

    @Output() create = new EventEmitter<void>();
    @Output() view = new EventEmitter<T>();
    @Output() edit = new EventEmitter<T>();
    @Output() remove = new EventEmitter<T>();

    dataSource = new MatTableDataSource<T>([]);
    displayedColumns: string[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    columnKeys: string[] = [];

    ngOnChanges(): void {
        this.dataSource.data = this.data ?? [];
        this.columnKeys = (this.config?.columns ?? []).map(c => `${c.key}`);
        this.displayedColumns = [...this.columnKeys, 'actions'];
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        // filtro por cualquier columna
        this.dataSource.filterPredicate = (row: T, filter: string) => {
            const v = filter.trim().toLowerCase();
            return this.config.columns.some(col => {
                const raw = col.cell ? col.cell(row) : String(row[col.key as keyof T] ?? '');
                return raw.toLowerCase().includes(v);
            });
        };
    }

    applyFilter(value: string) {
        this.dataSource.filter = value.trim().toLowerCase();
        if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
    }

    cellValue(row: T, key: string) {
        const col = this.config.columns.find(c => `${c.key}` === key);
        if (!col) return '';
        return col.cell ? col.cell(row) : `${row[col.key as keyof T] ?? ''}`;
    }

}
